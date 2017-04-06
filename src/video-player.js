import React, {Component} from 'react';
import {connect} from 'react-redux';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {animationLoopRunning: false};
  }

  render() {
    return (
        <div ref={el => this.container = el} className="videoPlayer" />
    );
  }

  componentDidMount() {
    if (!this.videoCanvas) {
      this.videoCanvas = document.createElement('canvas');
      // FIXME: should be configurable via props or something
      this.videoCanvas.width = this.videoCanvas.height = 512;

      // FIXME: move to stylesheet
      this.videoCanvas.style = `width: 100vw; height: 100vh;`;
      this.videoCanvasCtx = this.videoCanvas.getContext('2d');

      this.startAnimationLoop();
    }

    // FIXME: this is not the canvas that should ultimately render to screen
    this.container.appendChild(this.videoCanvas);
  }

  componentWillUnmount() {
    this.stopAnimationLoop();
    this.videoCanvas.parentNode.removeChild(this.videoCanvas);
  }

  // ---- animationLoop handling

  startAnimationLoop() {
    this.setState({animationLoopRunning: true});
    requestAnimationFrame(this.animationLoopTick.bind(this));
  }

  stopAnimationLoop() {
    this.setState({animationLoopRunning: false});
  }

  animationLoopTick() {
    if (!this.state.animationLoopRunning) { return; }

    requestAnimationFrame(this.animationLoopTick.bind(this));

    const activeVideos = this.props.videos
        .filter(video => video.isPlaying)
        .map(video => video.videoElement);

    const n = activeVideos.length;
    const ctx = this.videoCanvas.getContext('2d');
    const w = this.videoCanvas.width;
    const h = this.videoCanvas.height;

    if (n === 0) {
      ctx.clearRect(0, 0, w, h);
    } else {
      // FIXME: should consider a different implementation :/
      activeVideos.forEach((video, index) => {
        // FIXME: only use a portion of the source-video to prevent distortion
        ctx.drawImage(video, index * w / n, 0, w / n, h);
      });
    }

  }
}

const mapStateToProps = (state, ownProps) => {
  const {clips, scheduler, fileLoader} = state;

  const videos = Object.keys(clips).reduce((videos, id) => {
    const clip = clips[id];
    if (clip.type === 'video') {
      videos.push({
        ...clip,
        videoElement: fileLoader[clip.file],
        isPlaying: Object.keys(scheduler.playing).includes(clip.id)
      });
    }

    return videos;
  }, []);

  return {...ownProps, videos};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onClick: () => {
    //   dispatch(setVisibilityFilter(ownProps.foo));
    // }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);