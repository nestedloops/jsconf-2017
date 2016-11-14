const FILE_LOADED = 'jsconf2017/file-loader/FILE_LOADED';

export default function fileLoader(state = {}, action) {
  switch (action.type) {
    case FILE_LOADED:
      return {
        ...state,
        [action.id]: action.file
      };
    default:
      return state;
  }
}

export const fileLoaded = (id, file) => ({ type: FILE_LOADED, id, file });
