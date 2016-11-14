import React, { Component } from 'react';
import { connect } from 'react-redux'
import Button from './button';
import './arrangement.css';

class Arrangement extends Component {
  render() {
    return (
      <div className="arrangement">
        { [...Array(8)].map((_, y) =>
          <div className="arrangement__row" key={`arrangement-row-${y}`}>
            { [...Array(8)].map((_, x) => this.renderButton(x, y)) }
          </div>
        )}
      </div>
    );
  }

  renderButton(x, y) {
    const { arrangement, buttons, onButtonSelected, selectedButtonId } = this.props;
    const row = arrangement.buttons[y];
    const buttonId = row ? row[x] : undefined;
    const button = buttons[buttonId]
    const isEmpty = !buttonId || !button;
    const key = `arrangement-button-${x}-${y}`;
    if (isEmpty) { return <Button key={key} />; }
      console.log(selectedButtonId);
    return <Button
            key={key}
            button={button}
            selected={selectedButtonId === buttonId}
            onClick={() => onButtonSelected(buttonId)} />
  }
}

const mapStateToProps = (state) => ({
  controllers: state.controllers
});

export default connect(mapStateToProps)(Arrangement);
