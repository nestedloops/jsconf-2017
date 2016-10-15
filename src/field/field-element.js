import React from 'react';
import './field-element.css';

export default ({ highlighted, on }) =>
  <div className={`field__element
                   ${highlighted ? 'field__highlighted' : ''}
                   ${on ? 'field__on' : ''}`}>
  </div>
;
