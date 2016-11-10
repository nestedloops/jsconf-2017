import React from 'react';
import { connect } from 'react-redux'
import Button from './button';
import { withHandlers } from 'recompose';
import './arrangement.css';

const Arrangement = ({ arrangement, buttons, controllers, onControllerSelected, onButtonSelected }) =>
  <div className="arrangement">
    { [...Array(8)].map((_, y) =>
      <div className="arrangement__row" key={`arrangement-row-${y}`}>
        { [...Array(8)].map((_, x) => renderButton(x, y, arrangement.buttons, buttons, onButtonSelected)) }
      </div>
    )}
  </div>
;

const ProxiedArrangement = withHandlers({
  onControllerSelected: (props) => (event) => {
    console.log(event.target.value);
  }
})(Arrangement);

const mapStateToProps = (state) => ({
  controllers: state.controllers
});

export default connect(mapStateToProps)(ProxiedArrangement);

function renderButton(x, y, buttons, buttonValues, onButtonSelected) {
  const row = buttons[y];
  const buttonId = row ? row[x] : undefined;
  const button = buttonValues[buttonId]
  const isEmpty = !buttonId || !button;
  const key = `arrangement-button-${x}-${y}`;
  if (isEmpty) { return <Button key={key} />; }

  return <Button key={key} button={button} onClick={() => onButtonSelected(buttonId)} />
}
