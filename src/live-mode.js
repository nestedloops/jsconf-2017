import React, { Component } from 'react';
import './live-mode.css';

class LiveMode extends Component {
  componentDidMount() {
    console.log(this.video);

  }

  render() {
    const { isVisible } = this.props;
    return (
      <div className={`liveMode ${isVisible ? 'm-visible' : ''}`}>
        <video id="video" ref={(video) => this.video = video} />
      </div>
    );
  }
}

export default LiveMode;
