import React, { Component } from 'react';
import { connect } from 'react-redux'
import ArrangementEditor from './arrangement/arrangement-editor';
import DragAndDropReveicer from './files/drag-and-drop-receiver';
import FilesList from './files/files-list';
import Loader from './lib/loader';
import uuid from 'uuid';

import { addFile } from './data/files';

class App extends Component {
  render() {
    const { onDrop } = this.props;
    return (
      <div className="App">
        <ArrangementEditor />
        <FilesList />
        <Loader />
        <DragAndDropReveicer onDrop={onDrop} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    arrangement: state.arrangements.arrangement1
  };
};

const mapDispatchToProps = (dispatch) => ({
  onDrop: () => {
    const id = uuid.v4();
    dispatch(addFile(id, { name: 'dropped file', location: 'mysound.mp3' }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
