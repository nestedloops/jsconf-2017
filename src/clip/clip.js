import React from 'react';
import './clip.css';

export default ({ clip, onClick, selected }) =>
  <div className={`clip
                   ${clip ? 'clip__notEmpty' : ''}
                   ${selected ? 'clip__selected' : ''}`}
       onClick={onClick}>
  </div>
;
