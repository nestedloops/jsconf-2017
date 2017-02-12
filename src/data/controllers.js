/**
 * -------------------- ACTION TYPES ----------------------------
 */
const ADD_CONTROLLER = 'jsconf2017/controllers/ADD_CONTROLLER';
const MAP_CONTROLLER_TO_PAD = 'jsconf2017/controllers/MAP_CONTROLLER_TO_PAD';
const REMOVE_CONTROLLER = 'jsconf2017/controllers/REMOVE_CONTROLLER';

/**
 * -------------------- REDUCER ----------------------------
 */
export default function controllers(state = {}, action) {
  const { id, pad } = action;
  switch (action.type) {
    case ADD_CONTROLLER:
      return {
        ...state,
        [id]: {
          id,
          pad,
          controller: action.controller,
        }
      };
    case MAP_CONTROLLER_TO_PAD:
      return {
        ...state,
        [id]: {
          ...state[id],
          pad
        }
      };
    case REMOVE_CONTROLLER:
      const copy = { ...state };
      delete copy[id];
      return copy;
    default:
      return state;
  }
}

/**
 * -------------------- ACTION CREATORS ----------------------------
 */
export const addController = (id, controller, pad) => ({ type: ADD_CONTROLLER, id, controller, pad });
export const mapControllerToPad = (id, pad) => ({ type: MAP_CONTROLLER_TO_PAD, id, pad });
export const removeController = (id) => ({ type: REMOVE_CONTROLLER, id });
