const CHANGE_BUTTON_FIELD = 'jsconf2017/buttons/CHANGE_BUTTON_FIELD';

export default function buttons(state = {}, action) {
  switch (action.type) {
    case CHANGE_BUTTON_FIELD:
      const { id, field, value } = action;
      const button = state[id];
      return {
        ...state,
        [id]: { ...button, [field]: value }
      };
    default:
      return state;
  }
}

export const changeButtonField = (id, field, value) => ({ type: CHANGE_BUTTON_FIELD, id, field, value });
