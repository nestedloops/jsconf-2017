import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import Projects from './projects';
import Editor from './editor';
import Pads from './pad/pads';
import Tracks from './tracks/tracks';
import FilesList from './files/files-list';
import store from './lib/store';

import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Projects} />
      <Route path="/project/:project_id" component={Editor}>
        <Route path="/project/:project_id/pads" component={Pads} />
        <Route path="/project/:project_id/tracks" component={Tracks} />
        <Route path="/project/:project_id/files" component={FilesList} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
