import { combineReducers } from 'redux'

import buttons from './buttons';
import controllers from './controllers';
import fileLoader from './file-loader';
import files from './files';
import pads from './pads';
import scheduler from './scheduler';
import settings from './settings';
import tracks from './tracks';

export default combineReducers({
  buttons, controllers, fileLoader, files, pads, scheduler, settings, tracks
});
