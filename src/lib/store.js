import { /*applyMiddleware,*/ createStore } from 'redux';
// import createLogger from 'redux-logger';
import reducer from '../data/reducer';

export default createStore(
  reducer,
  {}
  // use for debugging
  // ,applyMiddleware(
  //   createLogger({collapsed: true })
  // )
);