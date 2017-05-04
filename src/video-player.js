import React, { Component } from 'react';
import { connect } from 'react-redux';
import VideoRenderer from './lib/video/renderer';

import './video-player.css';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.videoRenderer = new VideoRenderer();
    this.simpleVideoContainer = document.createElement('div');
    this.simpleVideoContainer.className = 'simpleVideoContainer';
  }

  render() {
    return (
      <div ref={ el => this.container = el } className="videoPlayer" />
    );
  }

  componentDidMount() {
    this.container.appendChild(this.simpleVideoContainer);
    this.container.appendChild(this.videoRenderer.getDomElement());
  }

  componentWillUpdate({ renderParams, videos, singleVideo }) {
    this.videoRenderer.setRenderParams(renderParams);
    this.videoRenderer.setVideos(videos);

    if (singleVideo && singleVideo !== this.props.singleVideo) {
      this.simpleVideoContainer.innerHTML = '';
      this.simpleVideoContainer.appendChild(singleVideo);
    }

    if (!singleVideo) {
      this.simpleVideoContainer.innerHTML = '';
    }
  }

  componentWillUnmount() {
    this.videoRenderer.stop();
    const domEl = this.videoRenderer.getDomElement();
    domEl.parentNode.removeChild(domEl);
  }
}

const mapStateToProps = (state, ownProps) => {
  const { scheduler, clips, videoRenderer } = state;
  const playingFileIds = Object.keys(scheduler.playing);

  const videos = playingFileIds
    .map((fileId) => {
      const clip = clips[scheduler.playing[fileId].clipId];
      if (clip && !clip.noFilter) {
        return scheduler.playing[fileId].payload.videoElement
      }
      return undefined;
    })
    .filter(Boolean);

  const singleVideo = playingFileIds
    .map((fileId) => {
      const clip = clips[scheduler.playing[fileId].clipId];
      if (clip && clip.noFilter) {
        return scheduler.playing[fileId].payload.videoElement
      }
      return undefined;
    })
    .filter(Boolean)
    .pop();

  const renderParams = videoRenderer.renderParams;

  return { videos, singleVideo, renderParams: { ...ownProps, ...renderParams } };
};

export default connect(mapStateToProps, null)(VideoPlayer);