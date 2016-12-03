import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  changeTrackGain,
  changeTrackName
} from '../data/tracks';

import './track-editor.css';

class TrackEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingName: false
    };
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
}

const mapStateToProps = (state, ownProps) => ({
  track: state.tracks[ownProps.trackId]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeTrackName(name) { dispatch(changeTrackName(ownProps.trackId, name)) },
  changeTrackGain(gain) { dispatch(changeTrackGain(ownProps.trackId, gain)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackEditor);
