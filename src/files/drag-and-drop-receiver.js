import React, { Component } from 'react';
import { isAudio } from '../lib/regular-expressions';

import './drag-and-drop-receiver.css';

export default class DragAndDropReveicer extends Component {
  constructor(props) {
    super(props);

    this.state = { showDropTarget: false };
  }

  componentDidMount() {
    document.body.addEventListener('dragenter', this.onDragEnter);
  }

  onDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('dragover');
    return false;
  }

  onDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('dragleave');
    this.setState({ showDropTarget: false })
    return false;
  }

  onDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showDropTarget: true });
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
        console.log(isAudio.test(file.type));
        containsSupportedFile = isAudio.test(file.type);
        if (containsSupportedFile) {
          this.props.onDrop();
          this.setState({ showDropTarget: false });
        }
      }
    }
    return false;
  }

  render() {
    const { showDropTarget } = this.state;
    return (
      <div
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        className={`dragAndDropReceiver ${showDropTarget && 'visible'}`}>
        drop iiiiitttt
      </div>
    );
  }
}
