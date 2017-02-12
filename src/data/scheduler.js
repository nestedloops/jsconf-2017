/**
 * -------------------- ACTION TYPES ----------------------------
 */
const ADD_SCHEDULED = 'jsconf2017/scheduler/ADD_SCHEDULED';
const ADD_PLAYING = 'jsconf2017/scheduler/ADD_PLAYING';
const ADD_TOSTOP = 'jsconf2017/scheduler/ADD_TOSTOP';
const AUDIO_ENDED = 'jsconf2017/scheduler/AUDIO_ENDED';
const FLUSH_SCHEDULED = 'jsconf2017/scheduler/FLUSH_SCHEDULED';

/**
 * -------------------- REDUCER ----------------------------
 */
export default function scheduler(state, action) {
  if (!state) {
    state = { scheduled: {}, toStop: {}, playing: {} };
  }

  const { id } = action;

  switch (action.type) {
    case ADD_SCHEDULED:
      return {
        ...state,
        scheduled: {
          ...state.scheduled,
          [id]: true
        }
      };
    case FLUSH_SCHEDULED:
      return {
        ...state,
        scheduled: {},
        toStop: {}
      };
    case ADD_PLAYING:
      const { audioNode } = action;
      return {
        ...state,
        playing: {
          ...state.playing,
          [id]: audioNode
        }
      };
    case ADD_TOSTOP:
      return {
        ...state,
        toStop: {
          ...state.toStop,
          [id]: true
        }
      };
    case AUDIO_ENDED:
      const playingCopy = { ...state.playing };

      delete playingCopy[id];

      return {
        ...state,
        playing: playingCopy
      };
    default:
      return state;
  }
}

/**
 * -------------------- ACTION CREATORS ----------------------------
 */
export const addPlaying = (id, audioNode) => ({ type: ADD_PLAYING, id, audioNode});
export const addScheduled = (id) => ({ type: ADD_SCHEDULED, id });
export const audioEnded = (id) => ({ type: AUDIO_ENDED, id });
export const flushScheduled = () => ({ type: FLUSH_SCHEDULED });
export const scheduleStop = (id) => ({ type: ADD_TOSTOP, id });
