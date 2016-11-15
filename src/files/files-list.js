import { connect } from 'react-redux';
import React from 'react';
import File from './file';

const mapStateToProps = (state) => ({
  files: state.files
});

export default connect(mapStateToProps)(({ files }) =>
  <div className="filesList">
    { Object.keys(files).map((fileId) => <File file={files[fileId]} key={`files-${fileId}`} />) }
  </div>
);
