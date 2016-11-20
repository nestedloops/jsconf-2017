const ADD_SCHEDULED = 'jsconf2017/scheduler/ADD_SCHEDULED';
const ADD_PLAYING = 'jsconf2017/scheduler/ADD_PLAYING';
const ADD_TOSTOP = 'jsconf2017/scheduler/ADD_TOSTOP';
const AUDIO_ENDED = 'jsconf2017/scheduler/AUDIO_ENDED';
const FLUSH_SCHEDULED = 'jsconf2017/scheduler/FLUSH_SCHEDULED';
const FLUSH_TOSTOP = 'jsconf2017/scheduler/FLUSH_TOSTOP';

export default function scheduler(state = {}, action) {
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
        scheduled: {}
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
    case FLUSH_TOSTOP:
      return {
        ...state,
        toStop: {}
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

export const addPlaying = (id, audioNode) => ({ type: ADD_PLAYING, id, audioNode});
export const audioEnded = (id) => ({ type: AUDIO_ENDED, id });
export const flushScheduled = () => ({ type: FLUSH_SCHEDULED });
