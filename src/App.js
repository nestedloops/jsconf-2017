import React, { Component } from 'react';
import { connect } from 'react-redux'
import ArrangementEditor from './arrangement/arrangement-editor';
import FilesList from './files/files-list';
import Loader from './lib/loader';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ArrangementEditor />
        <FilesList />
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
