import { combineReducers } from 'redux'

import pads from './pads';
import buttons from './buttons';
import controllers from './controllers';
import fileLoader from './file-loader';
import files from './files';
import scheduler from './scheduler';
import settings from './settings';

export default combineReducers({
  pads, buttons, controllers, fileLoader, files, scheduler, settings
});
