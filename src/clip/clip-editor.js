import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CLIP_TYPE_NONE,
  CLIP_TYPE_AUDIO_SAMPLE,
  CLIP_TYPE_VIDEO,
  CLIP_TYPES,
  AUDIO_BEHAVIOR_TYPES,
  changeClipField,
  deleteClip
} from '../data/clips';
import { getAudioFiles, getVideoFiles } from '../data/files';

import '../styles/forms.css';
import './clip-editor.css';

class ClipEditor extends Component {
  shouldComponentUpdate(newProps){
    return newProps.clip !== this.props.clip
        || newProps.tracks !== this.props.tracks;
  }

  render() {
    const currentType = this.props.clip.type || CLIP_TYPE_NONE;
    const { track, tracks } = this.props;

    return (
      <div className="clipEditor">
        <label className="editorForm__label">
          <span className="editorForm__labelText">Type:</span>
          <select
            value={currentType}
            onChange={this.changeType}
          >
            { CLIP_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        { this.renderForm() }
        <label className="editorForm__label editorForm__selectTrack">
          <span className="editorForm__labelText">Track:</span>
          <select
            className="clipEditor__clipSelect"
            value={track}
            onChange={this.changeTrack}
          >
            { Object.keys(tracks).map((trackId) => (
              <option key={trackId} value={trackId}>{tracks[trackId].name}</option>
            ))}
          </select>
        </label>

        <button onClick={this.deleteClip}>remove</button>
      </div>
    );
  }

  renderForm() {
    switch (this.props.clip.type) {
      case CLIP_TYPE_AUDIO_SAMPLE:
        return this.renderAudioForm();
      case CLIP_TYPE_VIDEO:
        return this.renderVideoForm();
      default:
        return null;
    }
  }

  renderAudioForm() {
    const { clip, audioFiles } = this.props;
    const { behavior, file, gain, loop } = clip;

    return (
      <form className="editorForm">
        <label className="editorForm__label">
          <span className="editorForm__labelText">Behavior:</span>
          <select
            value={behavior}
            onChange={this.changeBehavior}
          >
            { AUDIO_BEHAVIOR_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="editorForm__label">
          <input type="checkbox" onChange={this.changeLoop} checked={loop} /> loop
        </label>
        <label className="editorForm__label">
          <span className="editorForm__labelText">Gain:</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={this.changeGain}
            value={gain}
          />
        </label>
        <div className="editorForm__label">
          <span className="editorForm__labelText">Audio Sample:</span>
          <select
            value={file}
            onChange={this.changeFile}
          >
            <option key="none" value="none">----</option>
            { Object.keys(audioFiles).map((fileId) =>
              <option
                key={fileId}
                value={fileId}
              >{audioFiles[fileId].name}
              </option>
            )}
          </select>
        </div>
      </form>
    );
  }

  renderVideoForm() {
    const { clip, videoFiles } = this.props;
    const { file, gain, exclusive } = clip;

    return (
      <form className="editorForm">
        <label className="editorForm__label">
          <input type="checkbox" onChange={this.changeExclusive} checked={exclusive} /> exclusive
        </label>
        <label className="editorForm__label">
          <span className="editorForm__labelText">Gain:</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={this.changeGain}
            value={gain}
          />
        </label>
        <div className="editorForm__label">
          <span className="editorForm__labelText">Video File:</span>
          <select
            value={file}
            onChange={this.changeFile}
          >
            { Object.keys(videoFiles).map((fileId) =>
              <option
                key={fileId}
                value={fileId}
              >{videoFiles[fileId].name}
              </option>
            )}
          </select>
        </div>
      </form>
    );
  }

  changeBehavior = (event) => {
    this.props.changeClipField('behavior', event.target.value);
  }

  changeType = (event) => {
    this.props.changeClipField('type', event.target.value);
  }

  changeSchedulable = () => {
    this.props.changeClipField('schedulable', !this.props.clip.schedulable);
  }

  changeLoop = (event) => {
    this.props.changeClipField('loop', event.target.checked);
  }

  changeGain = (event) => {
    this.props.changeClipField('gain', parseFloat(event.target.value));
  }

  changeFile = (event) => {
    this.props.changeClipField('file', event.target.value);
  }

  changeTrack = (event) => {
    this.props.changeClipField('track', event.target.value);
  }

  deleteClip = (event) => {
    event.preventDefault();
    this.props.deleteClip(this.props.clip.id);
  }

}

const mapStateToProps = (state) => ({
  tracks: state.tracks,
  audioFiles: getAudioFiles(state),
  videoFiles: getVideoFiles(state)
});

const mapDispatchToProps = (dispatch, { clip, padId }) => ({
  changeClipField(field, value) {
    return dispatch(changeClipField(clip.id, field, value));
  },

  deleteClip(id) {
    dispatch(deleteClip(id, padId));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ClipEditor);
