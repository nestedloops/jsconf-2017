import React, { Component } from 'react';
import { connect } from 'react-redux'
const { dialog } = require('electron').remote;
import Pad from './pad';
import ClipEditor from '../clip/clip-editor';
import { selectClip, removePad } from '../data/pads';

import './pad-editor.css';

class PadEditor extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.pad !== nextProps.pad
        || this.props.clips !== nextProps.clips;
  }

  render() {
    const { pad, padId, clips, removePad } = this.props;
    const selectedClip = clips[pad.selectedClipId];
    const hasClipSelected = !!selectedClip;
    return (
      <div className="padEditor__container">
        <div className="padEdtor__controls">
          <button onClick={removePad}>Remove pad</button>
        </div>
        <Pad
          pad={pad}
          clips={clips}
          onClipSelected={this.onClipSelected}
          selectedClipId={pad.selectedClipId}
        />
        <div className="padEditor__clipEditor">
          { hasClipSelected && (
            <ClipEditor clip={selectedClip} padId={padId} />
          )}
        </div>
      </div>
    );
  }

  onClipSelected = (selectedClipId) => {
    const isTheSame = selectedClipId === this.props.pad.selectedClipId;

    this.props.selectClip(isTheSame ? null : selectedClipId);
  }
}

const mapStateToProps = (state, { padId }) => {
  return {
    pad: state.pads[padId],
    clips: state.clips
  };
};

const mapDispatchToProps = (dispatch, { padId }) => ({
  selectClip(selectedClipId) {
    dispatch(selectClip(selectedClipId, padId));
  },
  removePad() {
    const result = dialog.showMessageBox({
      message: 'Are you sure you want to remove this pad?',
      title: 'Removing Pad',
      buttons: ['No', 'Yes']
    });
    if (result === 1) {
      dispatch(removePad(padId));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PadEditor);
