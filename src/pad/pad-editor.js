import React, { Component } from 'react';
import { connect } from 'react-redux'
import Pad from './pad';
import ClipEditor from '../clip/clip-editor';
import { selectClip } from '../data/pads';

import './pad-editor.css';

class PadEditor extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.pad !== nextProps.pad
        || this.props.clips !== nextProps.clips;
  }

  render() {
    const { pad, clips } = this.props;
    const selectedClip = clips[pad.selectedClipId];
    const hasClipSelected = !!selectedClip;
    return (
      <div className="padEditor__container">
        <Pad
          pad={pad}
          clips={clips}
          onClipSelected={this.onClipSelected}
          selectedClipId={pad.selectedClipId}
        />
        <div className="padEditor__clipEditor">
          { hasClipSelected && (
            <ClipEditor clip={selectedClip} />
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

const mapStateToProps = (state) => {
  return {
    pad: state.pads.pad1,
    clips: state.clips
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectClip(selectedClipId) {
    dispatch(selectClip(selectedClipId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PadEditor);
