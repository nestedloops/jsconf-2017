export const ADD_FILE = 'jsconf2017/files/ADD_FILE';

export default function(state = {}, action) {
  const { id, file } = action;
  switch (action.type) {
    case ADD_FILE:
      return {
        ...state,
        [id]: file
      }
    default:
      return state;
  }
}

export const addFile = (id, file) => ({ type: ADD_FILE, id, file })
