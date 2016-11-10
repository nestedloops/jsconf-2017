import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import App from './App';
import reducer from './data/reducer';
import './index.css';

import initial from './data/initial';
const store = createStore(
  reducer,
  initial,
  applyMiddleware(createLogger())
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
