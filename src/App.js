import React, { Component } from 'react';
import { connect } from 'react-redux'
import logo from './logo.svg';
import './App.css';
import Field from './field/field';
import FilesList from './files/files-list';

const files = [
  {name: 'test video', url: 'http://weopifnwoei.mp4'},
  {name: 'test audio', url: 'http://song.mp3'}
];

class App extends Component {
  render() {
    const { field } = this.props;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Field field={field} />
        <FilesList files={files} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    field: state.fields['randomFieldId']
  };
};

export default connect(mapStateToProps)(App);
