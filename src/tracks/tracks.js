import React, { Component } from 'react';
import { connect } from 'react-redux'
import uuid from 'uuid';
import { createTrack } from '../data/tracks';
import TrackEditor from './track-editor';

class Tracks extends Component {
  render() {
    return (
      <div className="tracks">
        { Object.keys(this.props.tracks).map((trackId) =>
          <TrackEditor key={trackId} trackId={trackId} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tracks: state.tracks
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  createTrack() {
    const id = uuid.v4();
    dispatch(createTrack(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);
