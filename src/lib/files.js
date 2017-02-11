import { remote } from 'electron';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const userDataDirectory = remote.getGlobal('userDataDirectory');

export const userProjectDirectory = path.join(userDataDirectory, 'projects');

export function getProjectPath (projectId) {
  return path.join(userProjectDirectory, projectId);
}

export function getConfigPath (projectId) {
  return path.join(getProjectPath(projectId), 'project.json');
}

export function readConfig (projectId) {
  const configPath = getConfigPath(projectId);
  return JSON.parse(fs.readFileSync(configPath).toString());
}

export function persistStorePeriodically (projectId, store) {
  store.subscribe(_.throttle(() => {
    const filteredConfig = _.omit(store.getState(), ['scheduler', 'fileLoader', 'controllers']);
    saveAsProjectConfig(projectId, filteredConfig);
  }, 5000));
}

export function saveAsProjectConfig (projectId, projectConfig) {
  const configPath = getConfigPath(projectId);
  const configString = JSON.stringify(projectConfig, null, 2);
  fs.writeFileSync(configPath, configString);
}

export function saveProjectAsZip (projectId) {
  const projectPath = getProjectPath(projectId);
  const files = fs.readdirSync(projectPath);
  const zip = new JSZip();

  const readFileOperations = files.map((file) =>
    readFile(path.join(projectPath, file))
      .then((data) => zip.file(file, data))
  );

  Promise
    .all(readFileOperations)
    .then(() => zip.generateAsync({ type: 'blob'}))
    .then((blob) => saveAs(blob, `${projectId}.zip`));
}

function readFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, function(err, data){
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function importProjectFromZip (zipPath) {
  const projectName = zipPath.split(path.sep).pop().replace('.zip', '');
  let projectPath = getProjectPath(projectName);
  let counter = 1;

  // make sure not to overwrite a previous project with the same name
  while (fs.existsSync(projectPath)) {
    projectPath = `${getProjectPath(projectName)}-${counter++}`;
  }

  fs.mkdirSync(projectPath);

  const zip = new JSZip();
  const fileContent = fs.readFileSync(zipPath);
  return zip.loadAsync(fileContent)
            .then(() => {
              const promises = [];
              zip.forEach((filePath, file) => {
                promises.push(
                  new Promise((resolve) => {
                    file
                      .nodeStream()
                      .pipe(fs.createWriteStream(path.join(projectPath, filePath)))
                      .on('finish', resolve);
                  })
                );
              });
              return Promise.all(promises);
            });
}
