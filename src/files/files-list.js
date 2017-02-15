import { connect } from 'react-redux';
import React from 'react';
import { compose, shouldUpdate } from 'recompose';
import { removeFile } from '../data/files';
import { deleteClip } from '../data/clips';
import { deleteFile } from '../lib/files';
import store from '../lib/store';
import File from './file';
const { dialog } = require('electron').remote;

const FilesList = ({ files, deleteFile }) =>
  <div className="filesList">
    { Object.keys(files).map((fileId) =>
      <File
        key={`files-${fileId}`}
        file={files[fileId]}
        fileId={fileId}
        onDelete={deleteFile}
      />
    )}
  </div>
;

const mapStateToProps = (state) => ({
  files: state.files,
  clips: state.clips
});

const mapDispatchToProps = (dispatch, props) => ({
  deleteFile(fileId) {
    const { params: { project_id } } = props;
    const { clips, files } = store.getState();
    const affectedClips = Object.keys(clips)
                                .map((clipId) =>
                                  clips[clipId].file === fileId
                                )
                                .filter(Boolean)
    const affectedAmount = affectedClips.length;
    const extraMessage = `This file is used in ${affectedAmount} clips, cannot remove it`;
    const message = 'Are you shure you want to remove the file?';

    if (affectedAmount) {
      dialog.showMessageBox({
        message: extraMessage,
        title: 'Removing file',
        buttons: ['Okay']
      });
    } else {
      const result = dialog.showMessageBox({
        message,
        title: 'Removing file',
        buttons: ['No', 'Yes']
      });
      if (result === 1) {
        deleteFile(project_id, files[fileId].location);
        dispatch(removeFile(fileId));
      }
    }
  }
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  shouldUpdate((props, nextProps) => props.files !== nextProps.files)
)(FilesList);
