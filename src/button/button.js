import React from 'react';
import './button.css';

export default ({ button, onClick, selected }) =>
  <div className={`button
                   ${button ? 'button__notEmpty' : ''}
                   ${selected ? 'button__selected' : ''}`}
       onClick={onClick}>
  </div>
;
