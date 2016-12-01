import React, { Component } from 'react';
import { connect } from 'react-redux'
import uuid from 'uuid';
import Button from '../button/button';
import { createButton } from '../data/buttons';
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
    const { pad, buttons, onButtonSelected, selectedButtonId } = this.props;
    const row = pad.buttons[y];
    const buttonId = row ? row[x] : undefined;
    const button = buttons[buttonId]
    const isEmpty = !buttonId || !button;
    const key = `pad-button-${x}-${y}`;
    if (isEmpty) { return <Button key={key} onClick={() => this.props.createButton(x, y)}/>; }
    return <Button
            key={key}
            button={button}
            selected={selectedButtonId === buttonId}
            onClick={() => onButtonSelected(buttonId)}
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
