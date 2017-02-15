import { createSelector } from 'reselect'
import { isAudio, isVideo } from '../lib/regular-expressions';

/**
 * -------------------- ACTION TYPES ----------------------------
 */
export const ADD_FILE = 'jsconf2017/files/ADD_FILE';
export const REMOVE_FILE = 'jsconf2017/files/REMOVE_FILE';

/**
 * -------------------- REDUCER ----------------------------
 */
export default function(state = {}, action) {
  const { id, file } = action;
  switch (action.type) {
    case ADD_FILE:
      return {
        ...state,
        [id]: file
      }
    case REMOVE_FILE:
      const files = { ...state };
      delete files[id];
      return files;
    default:
      return state;
  }
}

/**
 * -------------------- ACTION CREATORS ----------------------------
 */
export const addFile = (id, file) => ({ type: ADD_FILE, id, file });
export const removeFile = (id) => ({ type: REMOVE_FILE, id });

/**
 * -------------------- SELECTORS ----------------------------
 */
const getFiles = (state) => state.files

function fileIsAudio(file) { return isAudio.test(file.location); }
function fileIsVideo(file) { return isVideo.test(file.location); }

export const getAudioFiles = createSelector(
  [getFiles],
  (files) => Object.keys(files)
               .filter((id) => fileIsAudio(files[id]))
               .reduce((res, id) => Object.assign(res, { [id]: files[id] }), {})
);

export const getVideoFiles = createSelector(
  [getFiles],
  (files) => Object.keys(files)
               .filter((id) => fileIsVideo(files[id]))
               .reduce((res, id) => Object.assign(res, { [id]: files[id] }), {})
)
