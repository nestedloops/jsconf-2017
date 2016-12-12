import { remote } from 'electron';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

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
    const filteredConfig = _.omit(store.getState(), ['scheduler']);
    saveAsProjectConfig(projectId, filteredConfig);
  }, 5000));
}

export function saveAsProjectConfig (projectId, projectConfig) {
  const configPath = getConfigPath(projectId);
  const configString = JSON.stringify(projectConfig, null, 2);
  fs.writeFileSync(configPath, configString);
}
