import React, { Component } from 'react';
import VideoPlayer from './video-player.js';

import './live-mode.css';

class LiveMode extends Component {
  render() {
    const {isVisible} = this.props;
    return (
      <div className={`liveMode ${isVisible ? 'm-visible' : ''}`}>
        <VideoPlayer />
      </div>
    );
  }
}

export default LiveMode;
