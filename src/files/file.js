import React from 'react';
import { withHandlers } from 'recompose';
import './file.css'

const File = ({ file, fileId, onButtonClick }) =>
  <div className="file">
    <span className="file__name">{file.name}</span>
    <button className="file__deleteButton m-no-highlight" onClick={onButtonClick}>delete</button>
  </div>
;

export default withHandlers({
  onButtonClick: ({ onDelete, fileId }) => (event) => {
    event.preventDefault();
    onDelete(fileId)
  }
})(File);
