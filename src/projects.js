import React from 'react';
import fs from 'fs';
import path from 'path';
import { Link } from 'react-router';
import log from 'electron-log';
import { shell } from 'electron';
import junk from 'junk';
import { userProjectDirectory, importProjectFromZip } from './lib/files';
import blankProject from './data/blank_project.json';
const { dialog } = require('electron').remote;

import './projects.css'

export default class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: null,
      importing: false,
      showNewForm: false
    };
  }

  componentDidMount() {
    this.syncDirectories();
  }

  render() {
    const { projects, showNewForm, importing } = this.state;
    const notReady = !projects;
    const noProjects = !notReady && projects.length === 0;
    const hasProjects = !!projects && projects.length > 0;
    const importButtonLabel = importing ? 'Importing...' : 'Import project';

    return (
      <div className="projects">
        { notReady && (
          <p>{'Scanning for projects...'}</p>
        )}

        { noProjects && (
          <p>{'No projects yet'}</p>
        )}

        { hasProjects && (
          <ul className="projects__list">
            { projects.map((projectId, index) =>
              <li className="projects__listItem" key={index}>
                <Link className="projects__link" to={`/project/${projectId}`}>{projectId}</Link>
              </li>
            )}
          </ul>
        )}

        <div className="projects__actions">
          { showNewForm && (
            <form className="projects__newForm" onSubmit={this.createNewProject}>
              <input
                autoFocus
                className="projects__newFormInput"
                ref={(input) => this.input = input}
                type="text"
                placeholder="Enter project name"
              />
            </form>
          )}

          <button
            onClick={this.showNewProjectForm}
            disabled={showNewForm}
          >
            New project
          </button>
          <button
            className="projects__button"
            onClick={this.importProject}
            disabled={importing}
          >
            { importButtonLabel }
          </button>
          <button
            className="projects__button"
            onClick={this.openProjectsFolder}
          >
            Open projects folder
          </button>
        </div>
      </div>
    );
  }

  showNewProjectForm = () => {
    this.setState({
      showNewForm: true
    });
  }

  createNewProject = (event) => {
    event.preventDefault();
    const projectName = this.input.value;
    const projectPath = path.join(userProjectDirectory, projectName);
    const projectExists = fs.existsSync(projectPath);

    if (projectName && !projectExists) {
      const projectFilePath = path.join(projectPath, 'project.json');
      fs.mkdirSync(projectPath);
      fs.writeFileSync(projectFilePath, JSON.stringify(blankProject, null, 2));
      this.syncDirectories();
      this.setState({
        showNewForm: false
      });
    }
  }

  importProject = (event) => {
    event.preventDefault();
    const files = dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Zip files', extensions: ['zip'] }
      ]
    });
    if (files) {
      const file = files.pop();
      this.setState({ importing: true });
      importProjectFromZip(file)
        .then(() => this.setState({ importing: false }))
        .then(() => this.syncDirectories());
    }
  }

  syncDirectories() {
    fs.readdir(userProjectDirectory, (err, dirs) => {
      if (err) {
        this.createProjectsDirectory();
        this.setState({ projects: [] });
      } else {
        this.setState({ projects: dirs.filter(junk.not) })
      }
    });
  }

  createProjectsDirectory() {
    fs.mkdir(userProjectDirectory, (err) => {
      if (err) {
        const message = 'Could not create projects directory: ' + err.toString();
        log.error(message);
        alert(message);
      }
    });
  }

  openProjectsFolder = () => {
    shell.openItem(userProjectDirectory);
  }
}
