import React, { Component } from 'react';
import { connect } from 'react-redux';
import audioContext from './audio/context';
import { fileLoaded } from '../data/file-loader';
import { getProjectPath } from './files';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';

const audioFile = /(mp3|wav|ogg)/;

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
    const isAudio = audioFile.test(file.location);

    if (isAudio) {
      this.loadAudioFile(file, id);
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

}

const mapStateToProps = (state) => ({
  files: state.files,
  fileLoader: state.fileLoader
});

export default connect(mapStateToProps)(Loader);
