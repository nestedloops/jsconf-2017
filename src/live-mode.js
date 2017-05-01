import React, { Component } from 'react';

import VideoPlayer from './video-player.js';
import VideoControlsGui from './video-controls-gui.js';

import './live-mode.css';

class LiveMode extends Component {
  constructor(props) {
    super(props);

    this.state = { visible: false, showVideoControls: false };
  }

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      // switch to LIVE mode when pressing TAB
      if (event.key === 'Tab') {
        event.preventDefault();
        this.setState({ visible: !this.state.visible });
      }

      // show video gui by pressing 'v'
      if (event.key === 'v') {
        event.preventDefault();
        this.setState({ showVideoControls: !this.state.showVideoControls });
      }
    });
  }

  render() {
    const { visible, showVideoControls } = this.state;
    return (
      <div className={`liveMode ${visible ? 'm-visible' : ''}`}>
        <VideoPlayer />
        {visible && showVideoControls && <VideoControlsGui />}
      </div>
    );
  }
}

export default LiveMode;
