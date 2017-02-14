import React, { Component } from 'react';
import { connect } from 'react-redux';
import audioContext from './audio/context';
import { fileLoaded } from '../data/file-loader';
import { getProjectPath } from './files';
import { isAudio, isVideo } from './regular-expressions'
import path from 'path';
import fs from 'fs';
import log from 'electron-log';

class Loader extends Component {
  shouldComponentUpdate(props) {
    return Object.keys(props.files).length !== Object.keys(this.props.files).length
        || Object.keys(props.fileLoader).length !== Object.keys(this.props.fileLoader).length
  }

  componentDidMount() {
    const { files } = this.props;

    Object.keys(files).forEach((fileId) => {
      this.loadFile(files[fileId], fileId);
    });
  }

  componentWillUpdate(nextProps) {
    const { files, fileLoader } = this.props;
    if (nextProps.files !== files) {
      Object
        .keys(nextProps.files)
        .filter((fileId) => {
          return !fileLoader[fileId];
        })
        .forEach((fileId) => {
          this.loadFile(nextProps.files[fileId], fileId);
        });
    }
  }

  render() {
    const { files, fileLoader } = this.props;
    const totalFiles = Object.keys(files).length;
    const loadedFiles = Object.keys(fileLoader).length;
    var text = '';

    if (loadedFiles === totalFiles) {
      text = 'All files loaded.';
    } else {
      text = `${loadedFiles} out of ${totalFiles} files loaded.`;
    }

    return <div className="loader">{text}</div>;
  }

  loadFile(file, id) {
    if (isAudio.test(file.location)) {
      this.loadAudioFile(file, id);
    } else if (isVideo.test(file.location)) {
      this.loadVideoFile(file, id);
    }
  }

  loadAudioFile(file, id) {
    const filePath = path.join(getProjectPath(this.props.projectId), file.location);
    return new Promise((resolve, reject) => {
        resolve(fs.readFileSync(filePath));
      })
      .then((fileBuffer) => fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength))
      .then((arrayBuffer) => {
        return new Promise((resolve, reject) => {
          audioContext.decodeAudioData(arrayBuffer, resolve, reject);
        });
      })
      .then((audioBuffer) => {
        this.props.dispatch(fileLoaded(id, audioBuffer));
      }).catch((error) => {
        log.error('could not load audio file: ' + filePath);
        log.error(error.toString());
      });
  }

  loadVideoFile(file, id) {
    const filePath = path.join(getProjectPath(this.props.projectId), file.location);

    return new Promise((resolve, reject) => {
      const data = fs.readFileSync(filePath);
      const blob = new Blob([data], {type: 'video/mp4'});
      const videoElement = document.createElement('video');
      videoElement.preload = 'auto';
      videoElement.src = URL.createObjectURL(blob);
      this.props.dispatch(fileLoaded(id, videoElement));
      resolve();
    });
  }

}

const mapStateToProps = (state) => ({
  files: state.files,
  fileLoader: state.fileLoader
});

export default connect(mapStateToProps)(Loader);
