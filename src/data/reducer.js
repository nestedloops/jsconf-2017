import { combineReducers } from 'redux'

import arrangements from './arrangements';
import buttons from './buttons';
import fileLoader from './file-loader';
import files from './files';
import settings from './settings';

export default combineReducers({
  arrangements, buttons, fileLoader, files, settings
});
