import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  changeTrackGain,
  changeTrackName,
  removeTrack
} from '../data/tracks';

import './track-editor.css';

class TrackEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingName: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.track !== this.props.track
        || nextState.editingName !== this.state.editingName;
  }

  render() {
    const { editingName } = this.state;
    const { track: { gain, name } } = this.props;

    return (
      <div className="trackEditor">
        { editingName && (
          <input
            ref={(input) => this.nameInput = input}
            type="text"
            onChange={this.onChangeText}
            onBlur={this.leaveEditMode}
            value={name}
            placeholder="Name the track..."
            className="trackEditor__nameInput"
          />
        )}

        { !editingName && (
          <h3
            onClick={this.enterEditMode}
            className="trackEditor__name"
          >{name}</h3>
        )}

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          onChange={this.changeGain}
          value={gain}
        />
        <button onClick={this.removeTrack}>{'remove track'}</button>
      </div>

    );
  }

  enterEditMode = () => {
    this.setState({ editingName: true }, () => this.nameInput.focus());
  }

  leaveEditMode = () => {
    this.setState({ editingName: false });
  }

  onChangeText = (event) => {
    this.props.changeTrackName(event.target.value);
  }

  changeGain = (event) => {
    const gain = parseFloat(event.target.value, 10);
    this.props.changeTrackGain(gain);
  }

  removeTrack = () => {
    const { trackId, clips } = this.props;

    if (trackId === 'master') {
      return alert('You cannot remove the master track');
    }

    const associatedClip = Object
                            .keys(clips)
                            .find((clipId) => clips[clipId].track === trackId);

    if (associatedClip) {
      return alert('The track has still clips associated to it');
    }

    this.props.removeTrack();
  }
}

const mapStateToProps = (state, ownProps) => ({
  track: state.tracks[ownProps.trackId],
  clips: state.clips
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeTrackName(name) { dispatch(changeTrackName(ownProps.trackId, name)) },
  changeTrackGain(gain) { dispatch(changeTrackGain(ownProps.trackId, gain)) },
  removeTrack() { dispatch(removeTrack(ownProps.trackId)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackEditor);
