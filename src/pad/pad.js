import React, { Component } from 'react';
import { connect } from 'react-redux'
import uuid from 'uuid';
import Button from '../clip/clip';
import { createButton } from '../data/clips';
import { selectButton } from '../data/pads';
import './pad.css';

class Pad extends Component {
  render() {
    return (
      <div className="pad">
        { [...Array(8)].map((_, y) =>
          <div className="pad__row" key={`pad-row-${y}`}>
            { [...Array(8)].map((_, x) => this.renderButton(x, y)) }
          </div>
        )}
      </div>
    );
  }

  renderButton(x, y) {
    const { pad, clips, onButtonSelected, selectedButtonId } = this.props;
    const row = pad.clips[y];
    const clipId = row ? row[x] : undefined;
    const clip = clips[clipId]
    const isEmpty = !clipId || !clip;
    const key = `pad-clip-${x}-${y}`;
    if (isEmpty) { return <Button key={key} onClick={() => this.props.createButton(x, y)}/>; }
    return <Button
            key={key}
            clip={clip}
            selected={selectedButtonId === clipId}
            onClick={() => onButtonSelected(clipId)}
          />
  }
}

const mapStateToProps = (state) => ({
  controllers: state.controllers
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  createButton(x, y) {
    const id = uuid.v4();
    dispatch(createButton(x, y, id));
    dispatch(selectButton(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Pad);
