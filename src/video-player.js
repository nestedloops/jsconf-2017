import React, { Component } from 'react';
import { connect } from 'react-redux';

import VideoRenderer from './lib/video/renderer';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.videoRenderer = new VideoRenderer();
    this.state = { animationLoopRunning: false };
  }

  render() {
    return (
      <div ref={ el => this.container = el } className="videoPlayer" />
    );
  }

  componentDidMount() {
    this.container.appendChild(this.videoRenderer.getDomElement());
  }

  componentWillUpdate(nextProps) {
    this.videoRenderer.setVideos(nextProps.videos);
  }

  componentWillUnmount() {
    const domEl = this.videoRenderer.getDomElement();
    domEl.parentNode.removeChild(domEl);
  }
}

const mapStateToProps = (state) => {
  const { scheduler } = state;
  const playingFileIds = Object.keys(scheduler.playing);

  const videos = playingFileIds
    .map((fileId) => scheduler.playing[fileId].payload.videoElement)
    .filter(Boolean);

  return { videos };
};

export default connect(mapStateToProps, null)(VideoPlayer);