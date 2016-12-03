import { connect } from 'react-redux';
import React from 'react';
import { compose, shouldUpdate } from 'recompose';
import File from './file';

const FilesList = ({ files }) =>
  <div className="filesList">
    { Object.keys(files).map((fileId) => <File file={files[fileId]} key={`files-${fileId}`} />) }
  </div>
;

const mapStateToProps = (state) => ({
  files: state.files
});

export default compose(
  connect(mapStateToProps),
  shouldUpdate((props, nextProps) => props.files !== nextProps.files)
)(FilesList);
