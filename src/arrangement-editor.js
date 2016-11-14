import React, { Component } from 'react';
import { connect } from 'react-redux'
import Arrangement from './arrangement/arrangement';
import ButtonEditor from './button-editor';

class ArrangementEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedButtonId: '2316526c-ec07-4153-a47a-d831b2aaf18e' };
  }

  render() {
    const { arrangement, buttons } = this.props;
    const { selectedButtonId } = this.state;
    const selectedButton = buttons[this.state.selectedButtonId];
    return (
      <div>
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

  onButtonSelected = (selectedButtonId) => this.setState({ selectedButtonId })
}

const mapStateToProps = (state) => {
  return {
    arrangement: state.arrangements.arrangement1,
    buttons: state.buttons
  };
};

export default connect(mapStateToProps)(ArrangementEditor);
