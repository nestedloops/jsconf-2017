import React, { Component } from 'react';
import { connect } from 'react-redux'
import { createTrack } from '../data/tracks';
import TrackEditor from './track-editor';

class Tracks extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.tracks !== this.props.tracks;
  }

  render() {
    return (
      <div className="tracks">
        { Object.keys(this.props.tracks).map((trackId) =>
          <TrackEditor key={trackId} trackId={trackId} />
        )}
        <hr />
        <button onClick={this.createTrack}>{'Add new track'}</button>
      </div>
    );
  }

  createTrack = () => {
    this.props.createTrack();
  }
}

const mapStateToProps = (state) => ({
  tracks: state.tracks
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  createTrack() {
    dispatch(createTrack());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);
