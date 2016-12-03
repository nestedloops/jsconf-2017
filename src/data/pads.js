import { CREATE_CLIP, DELETE_CLIP } from './clips';

const SELECT_CLIP = 'jsconf2017/pads/SELECT_CLIP';

export default function pads(state = {}, action) {
  switch (action.type) {
    case CREATE_CLIP:
    case SELECT_CLIP:
    case DELETE_CLIP:
      const pad = state.pad1;
      return { pad1: padReducer(pad, action) };
    default:
      return state;
  }
}

function padReducer(state, action) {
  switch (action.type) {
    case CREATE_CLIP: {
      const { clips } = state;
      const { x, y, id } = action;

      return {
        ...state,
        clips: changeValueAtPoint({
          array2d: clips,
          value: id,
          x, y
        })
      };
    }

    case SELECT_CLIP: {
      return {
        ...state,
        selectedButtonId: action.selectedButtonId
      };
    }

    case DELETE_CLIP: {
      const { clips } = state;
      const { id } = action;
      const coordinates = findIn2dArray(clips, id);

      if (!coordinates) { return state; }

      const { x, y } = coordinates;

      return {
        ...state,
        clips: changeValueAtPoint({
          array2d: clips,
          value: null,
          x, y
        })
      };
    }
    default:
      return state;
  }
}

function findIn2dArray(array2d, value) {
  for (var y = 0; y < 8; y++) {
    for (var x = 0; x < array2d.length; x++) {
      if (array2d[y][x] === value) {
        return { x, y };
      }
    }
  }
  return null;
}

function changeValueAtPoint({x, y, value, array2d}){
  const newRow = [
    ...array2d[y].slice(0, x),
    value,
    ...array2d[y].slice(x + 1)
  ];

  return array2d.slice(0, y)
                 .concat([newRow])
                 .concat(array2d.slice(y + 1));
}

export const selectButton = (selectedButtonId) => ({ type: SELECT_CLIP, selectedButtonId });
