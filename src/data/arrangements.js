import { CREATE_BUTTON } from './buttons';

const SELECT_BUTTON = 'jsconf2017/arrangements/SELECT_BUTTON';

export default function arrangements(state = {}, action) {
  switch (action.type) {
    case CREATE_BUTTON:
    case SELECT_BUTTON:
      const arrangement = state.arrangement1;
      return { arrangement1: arrangementReducer(arrangement, action) };
    default:
      return state;
  }
}

function arrangementReducer(state, action) {
  switch (action.type) {
    case CREATE_BUTTON:
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
    case SELECT_BUTTON:
      return {
        ...state,
        selectedButtonId: action.selectedButtonId
      };
    default:
      return state;
  }
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
