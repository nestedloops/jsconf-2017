import React, { Component } from 'react';
import { connect } from 'react-redux'
import Pad from './pad';
import ButtonEditor from '../clip/clip-editor';
import { selectButton } from '../data/pads';

import './pad-editor.css';

class PadEditor extends Component {
  render() {
    const { pad, clips } = this.props;
    const selectedButton = clips[pad.selectedButtonId];
    const hasButtonSelected = !!selectedButton;
    return (
      <div className="padEditor__container">
        <Pad
          pad={pad}
          clips={clips}
          onButtonSelected={this.onButtonSelected}
          selectedButtonId={pad.selectedButtonId}
        />
        <div className="padEditor__clipEditor">
          { hasButtonSelected && (
            <ButtonEditor clip={selectedButton} />
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
    clips: state.clips
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectButton(selectedButtonId) {
    dispatch(selectButton(selectedButtonId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PadEditor);
