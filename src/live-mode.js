import React, { Component } from 'react';
import VideoPlayer from './video-player.js';

import './live-mode.css';

class LiveMode extends Component {
  render() {
    const {isVisible} = this.props;
    return (
      <div className={`liveMode ${isVisible ? 'm-visible' : ''}`}>
        <VideoPlayer
            resolution="160x90"
            backgroundColor={0x000000}
            foregroundColor={0xe10079}
            pointSize={0.25}
            luminanceMin={0.2}
            luminanceMax={0.9}
            r0={0.9}
        />
      </div>
    );
  }
}

export default LiveMode;
