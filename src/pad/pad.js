import React, { Component } from 'react';
import { connect } from 'react-redux'
import uuid from 'uuid';
import Clip from '../clip/clip';
import { createClip } from '../data/clips';
import { selectClip } from '../data/pads';
import './pad.css';

class Pad extends Component {
  render() {
    return (
      <div className="pad">
        { [...Array(8)].map((_, y) =>
          <div className="pad__row" key={`pad-row-${y}`}>
            { [...Array(8)].map((_, x) => this.renderClip(x, y)) }
          </div>
        )}
      </div>
    );
  }

  renderClip(x, y) {
    const { pad, clips, onClipSelected, selectedClipId } = this.props;
    const row = pad.clips[y];
    const clipId = row ? row[x] : undefined;
    const clip = clips[clipId]
    const isEmpty = !clipId || !clip;
    const key = `pad-clip-${x}-${y}`;
    if (isEmpty) { return <Clip key={key} onClick={() => this.props.createClip(x, y)}/>; }
    return <Clip
            key={key}
            clip={clip}
            selected={selectedClipId === clipId}
            onClick={() => onClipSelected(clipId)}
          />
  }
}

const mapStateToProps = (state) => ({
  controllers: state.controllers
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  createClip(x, y) {
    const id = uuid.v4();
    dispatch(createClip(x, y, id));
    dispatch(selectClip(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Pad);
