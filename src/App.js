import React, { Component } from 'react';
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
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Field width={4} height={2} />
        <FilesList files={files} />
      </div>
    );
  }
}

export default App;
