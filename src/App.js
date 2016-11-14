import React, { Component } from 'react';
import { connect } from 'react-redux'
import ArrangementEditor from './arrangement-editor';
import FilesList from './files/files-list';
import Loader from './lib/loader';

const files = [
  {name: 'test video', url: 'http://weopifnwoei.mp4'},
  {name: 'test audio', url: 'http://song.mp3'}
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <ArrangementEditor />
        <FilesList files={files} />
        <Loader />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    arrangement: state.arrangements.arrangement1
  };
};

export default connect(mapStateToProps)(App);
