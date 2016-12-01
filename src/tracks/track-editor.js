import React, { Component } from 'react';
import { connect } from 'react-redux'
import { changeTrackName } from '../data/tracks';

class TrackEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };
  }

  render() {
    const { editing } = this.state;
    const { track: { name } } = this.props;

    return (
      <div className="track-editor">
        { editing && (
          <input
            ref={(input) => this.nameInput = input}
            type="text"
            onChange={this.onChangeText}
            onBlur={this.leaveEditMode}
            value={name}
            placeholder="Name the track..."
          />
        )}

        { !editing && (
          <h3 onClick={this.enterEditMode}>{name}</h3>
        )}

      </div>

    );
  }

  enterEditMode = () => {
    this.setState({ editing: true }, () => this.nameInput.focus());
  }

  leaveEditMode = () => {
    this.setState({ editing: false });
  }

  onChangeText = (event) => {
    this.props.changeTrackName(event.target.value);
  }
}

const mapStateToProps = (state, ownProps) => ({
  track: state.tracks[ownProps.trackId]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeTrackName(name) { dispatch(changeTrackName(ownProps.trackId, name)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackEditor);
