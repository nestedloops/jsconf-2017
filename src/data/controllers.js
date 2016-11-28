const ADD_CONTROLLER = 'jsconf2017/controllers/ADD_CONTROLLER';
const REMOVE_CONTROLLER = 'jsconf2017/controllers/REMOVE_CONTROLLER';

export default function controllers(state = {}, action) {
  switch (action.type) {
    case ADD_CONTROLLER:
      return {
        ...state,
        [action.id]: action.controller
      };
    case REMOVE_CONTROLLER:
      const copy = { ...state };
      delete copy[action.id];
      return copy;
    default:
      return state;
  }
}

export const addController = (id, controller) => ({ type: ADD_CONTROLLER, id, controller });
export const removeController = (id) => ({ type: REMOVE_CONTROLLER, id });
