import React from 'react';
import FieldElement from './field-element';
import './field.css';

export default ({width, height}) =>
  <div className="field">
    { [...Array(height)].map((_, index) =>
      <div className="field__row" key={`field-row-${index}`}>
        { [...Array(width)].map((_, index) =>
          <FieldElement key={`field-${index}`} />
        )}
      </div>
    )}

  </div>
;
