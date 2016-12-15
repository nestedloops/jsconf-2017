import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CLIP_TYPE_NONE,
  CLIP_TYPE_AUDIO_SAMPLE,
  CLIP_TYPES,
  AUDIO_BEHAVIOR_TYPES,
  changeClipField,
  deleteClip
} from '../data/clips';
import PlayAudioClip from './play-audio-clip';

import '../styles/forms.css';
import './clip-editor.css';

class ClipEditor extends Component {
  shouldComponentUpdate(newProps){
    return newProps.clip !== this.props.clip
        || newProps.fileLoader !== this.props.fileLoader
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
        <label className="editorForm__label">
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
          <hr />
          <div><button onClick={this.deleteClip}>delete clip</button></div>
        </label>
      </div>
    );
  }

  renderForm() {
    switch (this.props.clip.type) {
      case CLIP_TYPE_AUDIO_SAMPLE:
        return this.renderAudioForm();
      default:
        return null;
    }
  }

  renderAudioForm() {
    const { clip, files, fileLoader } = this.props;
    const { behavior, file, gain, loop } = clip;
    const preloadedFile = fileLoader[file];

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
            { Object.keys(files).map((fileId) =>
              <option
                key={fileId}
                value={fileId}
              >{files[fileId].name}
              </option>
            )}
          </select>
          { !!preloadedFile && (
            <PlayAudioClip
              config={clip}
              buffer={preloadedFile} />
          )}
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
  files: state.files,
  fileLoader: state.fileLoader,
  tracks: state.tracks
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
