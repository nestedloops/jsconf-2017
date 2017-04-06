import React, { Component } from 'react';
import './live-mode.css';

class LiveMode extends Component {
  render() {
    const {isVisible} = this.props;
    return (
      <div className={`liveMode ${isVisible ? 'm-visible' : ''}`} />
    );
  }
}

export default LiveMode;
