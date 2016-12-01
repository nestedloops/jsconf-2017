import React, { Component } from 'react';
import { connect } from 'react-redux'
import Pad from './pad';
import ButtonEditor from '../button/button-editor';
import { selectButton } from '../data/pads';

import './pad-editor.css';

class PadEditor extends Component {
  render() {
    const { pad, buttons } = this.props;
    const selectedButton = buttons[pad.selectedButtonId];
    const hasButtonSelected = !!selectedButton;
    return (
      <div className="padEditor__container">
        <Pad
          pad={pad}
          buttons={buttons}
          onButtonSelected={this.onButtonSelected}
          selectedButtonId={pad.selectedButtonId}
        />
        <div className="padEditor__buttonEditor">
          { hasButtonSelected && (
            <ButtonEditor button={selectedButton} />
          )}
        </div>
      </div>
    );
  }

  onButtonSelected = (selectedButtonId) => {
    const isTheSame = selectedButtonId === this.props.pad.selectedButtonId;

    this.props.selectButton(isTheSame ? null : selectedButtonId);
  }
}

const mapStateToProps = (state) => {
  return {
    pad: state.pads.pad1,
    buttons: state.buttons
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectButton(selectedButtonId) {
    dispatch(selectButton(selectedButtonId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PadEditor);
