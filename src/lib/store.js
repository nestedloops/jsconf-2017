import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import reducer from '../data/reducer';

const filerOutSchedulerMessages = (_, action) => {
  return !action.type.includes('FLUSH_');
};

export default createStore(
  reducer,
  {},
  applyMiddleware(
    createLogger({collapsed: true, predicate: filerOutSchedulerMessages})
  )
);