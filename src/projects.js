import React from 'react';
import fs from 'fs';
import { Link } from 'react-router';
import log from 'electron-log';
import { shell } from 'electron';
import { userProjectDirectory } from './lib/files';

import './projects.css'

export default class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: null
    };
  }

  componentWillMount() {
    this.syncDirectories();
  }

  render() {
    const { projects } = this.state;
    const notReady = !projects;
    const noProjects = !notReady && projects.length === 0;
    const hasProjects = !!projects && projects.length > 0;

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
              <li key={index}>
                <Link className="projects__link" to={`/project/${projectId}`}>{projectId}</Link>
              </li>
            )}
          </ul>
        )}

        <div className="projects__actions">
          <button className="projects__createNewProject">New project</button>
          <button
            className="projects__openProjectsFolder"
            onClick={this.openProjectsFolder}
          >Open projects folder</button>
        </div>
      </div>
    );
  }

  syncDirectories() {
    fs.readdir(userProjectDirectory, (err, dirs) => {
      if (err) {
        this.createProjectsDirectory();
        this.setState({ projects: [] });
      } else {
        this.setState({ projects: dirs })
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