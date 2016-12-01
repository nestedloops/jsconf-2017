const ADD_TRACK = 'jsconf2017/tracks/ADD_TRACK';
const CHANGE_TRACK_NAME = 'jsconf2017/tracks/CHANGE_TRACK_NAME';
const ADD_FILTER = 'jsconf2017/tracks/ADD_FILTER';
const REMOVE_TRACK = 'jsconf2017/tracks/REMOVE_TRACK';

export default function tracks(state = {}, action) {
  const { id } = action;
  const track = state[id];

  switch (action.type) {
    case ADD_TRACK:
      return {
        ...state,
        [id]: { name: '', filters: [] }
      };
    case CHANGE_TRACK_NAME:
      const { name } = action;
      return {
        ...state,
        [id]: {
          ...track,
          name
        }
      }
    case ADD_FILTER:
      const { filter } = action;
      return {
        ...state,
        [id]: {
          ...track,
          filters: [...track.filters, filter]
        }
      };
    case REMOVE_TRACK:
      const copy = { ...state };
      delete copy[id];
      return copy;
    default:
      return state;
  }
}

export const addTrack = (id) => ({ type: ADD_TRACK, id });
export const changeTrackName = (id, name) => ({ type: CHANGE_TRACK_NAME, id, name });
export const removeTrack = (id) => ({ type: REMOVE_TRACK, id });
