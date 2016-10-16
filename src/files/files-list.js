import React from 'react';
import File from './file';

export default ({ files = [] }) =>
  <div className="filesList">
    { files.map((file) => <File file={file} key={`files-${file.name}`} />) }
  </div>
;
