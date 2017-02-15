import React from 'react';
import './file.css'

export default ({ file, fileId, onDelete }) =>
  <div className="file" onClick={() => onDelete(fileId)}>{file.name}</div>
;
