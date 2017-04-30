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
    this.videoRenderer.setRenderParams(nextProps.renderParams);
    this.videoRenderer.setVideos(nextProps.videos);
  }

  componentWillUnmount() {
    const domEl = this.videoRenderer.getDomElement();
    domEl.parentNode.removeChild(domEl);
  }
}

const mapStateToProps = (state, ownProps) => {
  const { scheduler, videoRenderer } = state;
  const playingFileIds = Object.keys(scheduler.playing);

  const videos = playingFileIds
    .map((fileId) => scheduler.playing[fileId].payload.videoElement)
    .filter(Boolean);

  const renderParams = videoRenderer.renderParams;

  return { videos, renderParams: { ...ownProps, ...renderParams } };
};

export default connect(mapStateToProps, null)(VideoPlayer);