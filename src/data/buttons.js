const CHANGE_BUTTON_FIELD = 'jsconf2017/buttons/CHANGE_BUTTON_FIELD';
export const CREATE_BUTTON = 'jsconf2017/buttons/CREATE_BUTTON';

export default function buttons(state = {}, action) {
  const id = action.id;

  switch (action.type) {
    case CHANGE_BUTTON_FIELD:
      const { field, value } = action;
      const button = state[id];
      return {
        ...state,
        [id]: { ...button, [field]: value }
      };
    case CREATE_BUTTON:
      return {
        ...state,
        [id]: {}
      }
    default:
      return state;
  }
}

export const changeButtonField = (id, field, value) => ({ type: CHANGE_BUTTON_FIELD, id, field, value });
export const createButton = (x, y, id) => ({ type: CREATE_BUTTON, x, y, id });
