import React, { Component } from 'react';
import { connect } from 'react-redux'
import Arrangement from './arrangement';
import ButtonEditor from '../button/button-editor';
import { selectButton } from '../data/arrangements';

import './arrangement-editor.css';

class ArrangementEditor extends Component {
  render() {
    const { arrangement, buttons } = this.props;
    const selectedButton = buttons[arrangement.selectedButtonId];
    const hasButtonSelected = !!selectedButton;
    return (
      <div className="arrangementEditor__container">
        <Arrangement
          arrangement={arrangement}
          buttons={buttons}
          onButtonSelected={this.onButtonSelected}
          selectedButtonId={arrangement.selectedButtonId}
        />
        <div className="arrangementEditor__buttonEditor">
          { hasButtonSelected && (
            <ButtonEditor button={selectedButton} />
          )}
          { !hasButtonSelected&& (
            <p>Select a button to edit</p>
          )}
        </div>
      </div>
    );
  }

  onButtonSelected = (selectedButtonId) => {
    const isTheSame = selectedButtonId === this.props.arrangement.selectedButtonId;

    this.props.selectButton(isTheSame ? null : selectedButtonId);
  }
}

const mapStateToProps = (state) => {
  return {
    arrangement: state.arrangements.arrangement1,
    buttons: state.buttons
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectButton(selectedButtonId) {
    dispatch(selectButton(selectedButtonId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ArrangementEditor);
