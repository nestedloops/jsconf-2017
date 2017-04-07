import React, { Component } from 'react';
import { connect } from 'react-redux';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = { animationLoopRunning: false };
  }

  render() {
    return (
        <div ref={ el => this.container = el } className="videoPlayer" />
    );
  }

  componentDidMount() {
    if (!this.textureCanvas) {
      this.textureCanvas = document.createElement('canvas');

      // FIXME: should be configurable via props or something
      this.textureCanvas.width = 512;
      this.textureCanvas.height = 256;

      // FIXME: move to stylesheet
      this.textureCanvas.style = `width: 100vw; height: 100vh;`;
      this.videoCanvasCtx = this.textureCanvas.getContext('2d');
    }

    // FIXME: this is not the canvas that should ultimately render to screen
    this.container.appendChild(this.textureCanvas);
    this.startAnimationLoop();
  }

  componentWillUnmount() {
    this.stopAnimationLoop();
    this.textureCanvas.parentNode.removeChild(this.textureCanvas);
  }

  // ---- animationLoop handling
  startAnimationLoop() {
    if (this.state.animationLoopRunning) {
      return;
    }

    this.setState({ animationLoopRunning: true });
    requestAnimationFrame(this.animationLoopTick.bind(this));
  }

  stopAnimationLoop() {
    this.setState({ animationLoopRunning: false });
  }

  animationLoopTick() {
    if (!this.state.animationLoopRunning) {
      return;
    }

    requestAnimationFrame(this.animationLoopTick.bind(this));

    const activeVideos = this.props.videos;

    const n = activeVideos.length;
    const ctx = this.textureCanvas.getContext('2d');
    const w = this.textureCanvas.width;
    const h = this.textureCanvas.height;

    if (n === 0) {
      ctx.clearRect(0, 0, w, h);
    } else {
      activeVideos.forEach((video, index) => {
        // FIXME: only use a portion of the source-video to prevent distortion
        ctx.drawImage(video.videoElement, index * w / n, 0, w / n, h);
      });
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { clips, scheduler, fileLoader } = state;

  const videos = Object.keys(clips).reduce((videos, id) => {
    const clip = clips[id];
    const isPlaying = Object.keys(scheduler.playing).includes(clip.id);

    if (isPlaying && clip.type === 'video') {
      videos.push({
        ...clip,
        videoElement: fileLoader[clip.file]
      });
    }

    return videos;
  }, []);

  return { ...ownProps, videos };
};

export default connect(mapStateToProps, null)(VideoPlayer);