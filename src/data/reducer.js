import {
  CHANGE_BUTTON_FIELD
} from './actions';

export default (state = {}, action) => {

  switch (action.type) {
    case CHANGE_BUTTON_FIELD:
      const buttons = state.buttons;
      const { id, field, value } = action;
      const button = buttons[id];
      return {
        ...state,
        buttons: {
          ...buttons,
          [id]: { ...button, [field]: value }  
        }
      };
    default:
      return state;
  }
};
