import React from 'react';
import { connect } from 'react-redux'
import { compose, shouldUpdate } from 'recompose';
import { createPad } from '../data/pads';
import PadEditor from './pad-editor';

import './pads.css';

const Pads = ({ pads, createPad }) =>
  <div className="pads">
    {Object.keys(pads).map((padId) =>
      <div key={padId} className="pads__padContainer">
        <PadEditor key={padId} padId={padId} />
      </div>
    )}
    <button className="pads__addPad" onClick={createPad}>Add Pad</button>
  </div>
;

export default compose(
  connect(
    (state) => ({ pads: state.pads }),
    (dispatch) => ({ createPad() { dispatch(createPad()); }})
  ),
  shouldUpdate((props, nextProps) => props.pads !== nextProps.pads)
)(Pads);
