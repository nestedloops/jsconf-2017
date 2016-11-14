import React from 'react';
import './button.css';

export default ({ button, highlighted, on, onClick, selected }) =>
  <div className={`button
                   ${button ? 'button__notEmpty' : ''}
                   ${highlighted ? 'button__highlighted' : ''}
                   ${on ? 'button__on' : ''}
                   ${selected ? 'button__selected' : ''}`}
       onClick={onClick}>
  </div>
;
