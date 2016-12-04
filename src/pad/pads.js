import React from 'react';
import { connect } from 'react-redux'
import { compose, shouldUpdate } from 'recompose';
import PadEditor from './pad-editor';

import './pads.css';

const Pads = ({ pads }) =>
  <div className="pads">
    {Object.keys(pads).map((padId) =>
      <div key={padId} className="pads__padContainer">
        <PadEditor key={padId} padId={padId} />
      </div>
    )}
  </div>
;

export default compose(
  connect((state) => ({ pads: state.pads })),
  shouldUpdate((props, nextProps) => props.pads !== nextProps.pads)
)(Pads);
