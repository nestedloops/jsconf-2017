/**
 * -------------------- ACTION TYPES ----------------------------
 */
const ADD_SCHEDULED = 'jsconf2017/scheduler/ADD_SCHEDULED';
const ADD_PLAYING = 'jsconf2017/scheduler/ADD_PLAYING';
const ADD_TOSTOP = 'jsconf2017/scheduler/ADD_TOSTOP';
const MEDIA_ENDED = 'jsconf2017/scheduler/MEDIA_ENDED';
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
      const { payload, clipId } = action;
      return {
        ...state,
        playing: {
          ...state.playing,
          [id]: { payload, clipId }
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
    case MEDIA_ENDED:
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
 * -------------------- HELPERS ----------------------------
 */
export const playingId = (clipId, fileId) => `file:${fileId}-clip${clipId}`;
export const isPlaying = (playingState, clip) => playingState[playingId(clip.id, clip.file)] || playingState[playingId(clip.id, clip.videoFile)]

/**
 * -------------------- ACTION CREATORS ----------------------------
 */
export const addPlaying = (fileId, payload, clipId) => ({ type: ADD_PLAYING, id: playingId(clipId, fileId), payload, clipId});
export const addScheduled = (id) => ({ type: ADD_SCHEDULED, id });
export const mediaEnded = (fileId, clipId) => ({ type: MEDIA_ENDED, id: playingId(clipId, fileId) });
export const flushScheduled = () => ({ type: FLUSH_SCHEDULED });
export const scheduleStop = (id) => ({ type: ADD_TOSTOP, id });
