import { remote } from 'electron';
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