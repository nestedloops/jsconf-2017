const ADD_CONTROLLER = 'jsconf2017/controllers/ADD_CONTROLLER';

export default function controllers(state = {}, action) {
  switch (action.type) {
    case ADD_CONTROLLER:
      return {
        ...state,
        [action.id]: action.controller
      };
    default:
      return state;
  }
}

export const addController = (id, controller) => ({ type: ADD_CONTROLLER, id, controller });
