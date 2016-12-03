import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CLIP_TYPE_NONE,
  CLIP_TYPE_AUDIO_SAMPLE,
  CLIP_TYPES,
  AUDIO_BEHAVIOR_TYPES,
  changeButtonField,
  deleteButton
} from '../data/clips';
import PlayAudioButton from './play-audio-clip';

import './clip-editor.css';

class ButtonEditor extends Component {
  shouldComponentUpdate(newProps){
    return newProps.clip !== this.props.clip
        || newProps.fileLoader !== this.props.fileLoader;
  }

  render() {
    const currentType = this.props.clip.type || CLIP_TYPE_NONE;

    return (
      <div className="clipEditor">
        <label className="clipEditor__label">
          <span className="clipEditor__labelText">Type:</span>
          <select
            className="clipEditor__clipSelect"
            value={currentType}
            onChange={this.changeType}
          >
            { CLIP_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        { this.renderForm() }
        <button onClick={this.deleteButton}>delete</button>
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
      <form className="clipEditor__form">
        <label className="clipEditor__label">
          <span className="clipEditor__labelText">Behavior:</span>
          <select
            className="clipEditor__clipSelect"
            value={behavior}
            onChange={this.changeBehavior}
          >
            { AUDIO_BEHAVIOR_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="clipEditor__label">
          <input type="checkbox" onChange={this.changeLoop} checked={loop} /> loop
        </label>
        <label className="clipEditor__label">
          <span className="clipEditor__labelText">Gain:</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={this.changeGain}
            value={gain}
          />
        </label>
        <div className="clipEditor__label">
          <span className="clipEditor__labelText">Audio Sample:</span>
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
            <PlayAudioButton
              config={clip}
              buffer={preloadedFile} />
          )}
        </div>
      </form>
    );
  }

  changeBehavior = (event) => {
    this.props.changeButtonField('behavior', event.target.value);
  }

  changeType = (event) => {
    this.props.changeButtonField('type', event.target.value);
  }

  changeSchedulable = () => {
    this.props.changeButtonField('schedulable', !this.props.clip.schedulable);
  }

  changeLoop = (event) => {
    this.props.changeButtonField('loop', event.target.checked);
  }

  changeGain = (event) => {
    this.props.changeButtonField('gain', parseFloat(event.target.value));
  }

  changeFile = (event) => {
    this.props.changeButtonField('file', event.target.value);
  }

  deleteButton = (event) => {
    event.preventDefault();
    this.props.deleteButton(this.props.clip.id);
  }

}

const mapStateToProps = (state) => ({
  files: state.files,
  fileLoader: state.fileLoader
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeButtonField(field, value) {
    return dispatch(changeButtonField(ownProps.clip.id, field, value));
  },

  deleteButton(id) {
    dispatch(deleteButton(id));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonEditor);
