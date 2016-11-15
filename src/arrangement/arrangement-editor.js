import React, { Component } from 'react';
import { connect } from 'react-redux'
import Arrangement from './arrangement';
import ButtonEditor from '../button/button-editor';

import './arrangement-editor.css';

class ArrangementEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedButtonId: null };
  }

  render() {
    const { arrangement, buttons } = this.props;
    const { selectedButtonId } = this.state;
    const selectedButton = buttons[this.state.selectedButtonId];
    return (
      <div className="arrangementEditor__container">
        <Arrangement
          arrangement={arrangement}
          buttons={buttons}
          onButtonSelected={this.onButtonSelected}
          selectedButtonId={selectedButtonId}
        />
        { !!selectedButton && (
          <ButtonEditor button={selectedButton} />
        )}
      </div>
    );
  }

  onButtonSelected = (selectedButtonId) => {
    const isTheSame = selectedButtonId === this.state.selectedButtonId;
    this.setState({ selectedButtonId: isTheSame ? null : selectedButtonId });
  }
}

const mapStateToProps = (state) => {
  return {
    arrangement: state.arrangements.arrangement1,
    buttons: state.buttons
  };
};

export default connect(mapStateToProps)(ArrangementEditor);
