import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import App from './App';
import ArrangementEditor from './arrangement/arrangement-editor';
import FilesList from './files/files-list';
import reducer from './data/reducer';
import scheduler from './lib/scheduler';
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

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/arrangement" component={ArrangementEditor} />
        <Route path="/files" component={FilesList} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
