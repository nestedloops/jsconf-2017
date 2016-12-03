import React from 'react';
import { shouldUpdate } from 'recompose';
import './clip.css';

const Clip = ({ clipId, onClick, selected }) =>
  <div className={`clip
    ${clipId ? 'clip__notEmpty' : ''}
    ${selected ? 'clip__selected' : ''}`}
    onClick={onClick}>
  </div>
;

export default shouldUpdate(
  (props, nextProps) => props.clipId !== nextProps.clipId
                     || props.selected !== nextProps.selected
)(Clip);
