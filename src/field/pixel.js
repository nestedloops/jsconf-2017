import React from 'react';
import './pixel.css';

export default ({ pixel, highlighted, on, onClick }) =>
  <div className={`fieldPixel
                   ${pixel ? 'fieldPixel__notEmpty' : ''}
                   ${highlighted ? 'fieldPixel__highlighted' : ''}
                   ${on ? 'fieldPixel__on' : ''}`}
       onClick={onClick}>
  </div>
;
