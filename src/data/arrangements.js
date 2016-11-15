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
      const { x, y, id } = action;
      // copy old field and only change the new button field
      // cheap way to change a 2d array in an immutable way
      const newButtons = [];
      for (var i = 0; i < 8; i++) {
        var newRow = [];
        for (var j = 0; j < 8; j++) {
          if (y === i && x === j) {
            newRow.push(id);
          } else {
            newRow.push(state.buttons[i][j]);
          }
        }
        newButtons.push(newRow);
      }
      return {
        ...state,
        buttons: newButtons
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

export const selectButton = (selectedButtonId) => ({ type: SELECT_BUTTON, selectedButtonId });
