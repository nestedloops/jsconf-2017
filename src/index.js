import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import App from './app';
import PadEditor from './pad/pad-editor';
import Tracks from './tracks/tracks';
import FilesList from './files/files-list';
import reducer from './data/reducer';
import midi from './lib/midi';
import scheduler from './lib/scheduler';
import audioGraph from './lib/audio-graph';
import './index.css';

import initial from './data/initial';

const filerOutSchedulerMessages = (_, action) => {
  return !action.type.includes('FLUSH_');
};

const store = createStore(
  reducer,
  initial,
  applyMiddleware(
    createLogger({collapsed: true, predicate: filerOutSchedulerMessages})
  )
);

scheduler.init(store);
audioGraph.init(store);
midi.init(store, scheduler.handleManualSchedule);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/pads" component={PadEditor} />
        <Route path="/tracks" component={Tracks} />
        <Route path="/files" component={FilesList} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
