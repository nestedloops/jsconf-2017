import React, { Component } from 'react';
import './live-mode.css';

class LiveMode extends Component {
  render() {
    const { isVisible, containerReady } = this.props;
    return (
      <div ref={containerReady} className={`liveMode ${isVisible ? 'm-visible' : ''}`} />
    );
  }
}

export default LiveMode;
