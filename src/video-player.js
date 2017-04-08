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

const mapStateToProps = (state, ownProps) => {
  const { clips, scheduler, fileLoader } = state;
  const playingClipIds = Object.keys(scheduler.playing);

  const videos = [];
  Object.keys(clips).forEach(id => {
    const clip = clips[id];

    if (clip.type === 'video' && playingClipIds.includes(clip.id)) {
      videos.push({
        ...clip,
        videoElement: fileLoader[clip.file]
      });
    }
  });

  return { ...ownProps, videos };
};

export default connect(mapStateToProps, null)(VideoPlayer);