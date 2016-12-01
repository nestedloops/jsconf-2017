import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import DragAndDropReveicer from './files/drag-and-drop-receiver';
import Loader from './lib/loader';
import uuid from 'uuid';
import './app.css';

import Tracks from './tracks/tracks';

import { addFile } from './data/files';

class App extends Component {
  render() {
    const { children, onDrop } = this.props;
    return (
      <div className="app">
        <div className="app__container">
          <div className="app__navigation">
            <Link to="/pads" activeClassName="m-active" className="app__navigationItem">
              Pads
            </Link>
            <Link to="/files" activeClassName="m-active" className="app__navigationItem">Files</Link>
          </div>
          <div className="app__content">
            { children }
          </div>
        </div>
        <Tracks />
        <Loader />
        <DragAndDropReveicer onDrop={onDrop} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pad: state.pads.pad1
  };
};

const mapDispatchToProps = (dispatch) => ({
  onDrop: () => {
    const id = uuid.v4();
    dispatch(addFile(id, { name: 'dropped file', location: 'mysound.mp3' }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
