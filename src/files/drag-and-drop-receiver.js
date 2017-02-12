import React, { Component } from 'react';
import { isAudio } from '../lib/regular-expressions';

export default class DragAndDropReveicer extends Component {
  componentDidMount() {
    const { body } = document;
    body.addEventListener('dragenter', this.onDragEnter);
    body.addEventListener('dragover', this.onDragOver);
    body.addEventListener('drop', this.onDrop);
    body.addEventListener('dragleave', this.onDragLeave);
  }

  componentWillUnmount() {
    const { body } = document;
    body.removeEventListener('dragenter', this.onDragEnter);
    body.removeEventListener('dragover', this.onDragOver);
    body.removeEventListener('drop', this.onDrop);
    body.removeEventListener('dragleave', this.onDragLeave);
  }

  onDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { dataTransfer } = event;
    if (dataTransfer) {
      const { files } = dataTransfer;
      var containsSupportedFile = false;

      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        containsSupportedFile = isAudio.test(file.type);
        if (containsSupportedFile) {
          this.props.onDrop(file.path);
        }
      }
    }
    return false;
  }

  render() {
    return <div />;
  }
}
