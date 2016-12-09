import { combineReducers } from 'redux'

import clips from './clips';
import controllers from './controllers';
import fileLoader from './file-loader';
import files from './files';
import pads from './pads';
import scheduler from './scheduler';
import settings from './settings';
import tracks from './tracks';

const appReducer = combineReducers({
  clips, controllers, fileLoader, files, pads, scheduler, settings, tracks
});

const reducer = (state, action) => {
  if (action.type === 'init') {
    state = action.state;
  }

  return appReducer(state, action);
}

export default reducer;