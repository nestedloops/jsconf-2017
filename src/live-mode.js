import React, { Component } from 'react';

import VideoPlayer from './video-player.js';
import VideoControlsGui from './video-controls-gui.js';

import './live-mode.css';

class LiveMode extends Component {
  render() {
    const {isVisible} = this.props;
    return (
      <div className={`liveMode ${isVisible ? 'm-visible' : ''}`}>
        <VideoPlayer />
        {isVisible && <VideoControlsGui />}
      </div>
    );
  }
}

export default LiveMode;
