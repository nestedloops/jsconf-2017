import uuid from 'uuid';
import { CREATE_CLIP, DELETE_CLIP } from './clips';

/**
 * -------------------- ACTION TYPES ----------------------------
 */
const SELECT_CLIP = 'jsconf2017/pads/SELECT_CLIP';
const CREATE_PAD = 'jsconf2017/pads/CREATE_PAD';
const REMOVE_PAD = 'jsconf2017/pads/REMOVE_PAD';

/**
 * -------------------- REDUCER ----------------------------
 */
export default function pads(state = {}, action) {
  const { padId } = action;
  switch (action.type) {
    case CREATE_CLIP:
    case SELECT_CLIP:
    case DELETE_CLIP:
      const pad = state[padId];
      return {
        ...state,
        [padId]: padReducer(pad, action)
      };
    case CREATE_PAD:
      const id = uuid.v4();
      return {
        ...state,
        [id]: generateEmptyPad(id)
      };
    case REMOVE_PAD:
      const copiedPads = { ...state };
      delete copiedPads[padId];
      return copiedPads;
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
        selectedClipId: action.selectedClipId
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

/**
 * -------------------- ACTION CREATORS ----------------------------
 */
export const selectClip = (selectedClipId, padId) => ({ type: SELECT_CLIP, selectedClipId, padId });

export const createPad = () => ({ type: CREATE_PAD });

export const removePad = (padId) => ({ type: REMOVE_PAD, padId });

/**
 * -------------------- HELPERS ----------------------------
 */
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

function generateEmptyPad(id) {
  return {
    id,
    clips: [
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ]
    ],
    selectedClipId: null
  };
}
