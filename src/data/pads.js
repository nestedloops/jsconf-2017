import { CREATE_BUTTON, DELETE_BUTTON } from './buttons';

const SELECT_BUTTON = 'jsconf2017/pads/SELECT_BUTTON';

export default function pads(state = {}, action) {
  switch (action.type) {
    case CREATE_BUTTON:
    case SELECT_BUTTON:
    case DELETE_BUTTON:
      const pad = state.pad1;
      return { pad1: padReducer(pad, action) };
    default:
      return state;
  }
}

function padReducer(state, action) {
  switch (action.type) {
    case CREATE_BUTTON: {
      const { buttons } = state;
      const { x, y, id } = action;

      return {
        ...state,
        buttons: changeValueAtPoint({
          array2d: buttons,
          value: id,
          x, y
        })
      };
    }

    case SELECT_BUTTON: {
      return {
        ...state,
        selectedButtonId: action.selectedButtonId
      };
    }

    case DELETE_BUTTON: {
      const { buttons } = state;
      const { id } = action;
      const coordinates = findIn2dArray(buttons, id);

      if (!coordinates) { return state; }

      const { x, y } = coordinates;

      return {
        ...state,
        buttons: changeValueAtPoint({
          array2d: buttons,
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

export const selectButton = (selectedButtonId) => ({ type: SELECT_BUTTON, selectedButtonId });
