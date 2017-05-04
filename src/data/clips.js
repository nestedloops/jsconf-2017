/**
 * -------------------- ACTION TYPES ----------------------------
 */
const CHANGE_CLIP_FIELD = 'jsconf2017/clips/CHANGE_CLIP_FIELD';
export const CREATE_CLIP = 'jsconf2017/clips/CREATE_CLIP';
export const DELETE_CLIP = 'jsconf2017/clips/DELETE_CLIP';

export const CLIP_TYPE_NONE = 'select a type';
export const CLIP_TYPE_AUDIO_SAMPLE = 'audiosample';
export const CLIP_TYPE_AUDIO_AND_VIDEO = 'audioandvideo';
export const CLIP_TYPE_VIDEO = 'video';
export const CLIP_TYPES = [CLIP_TYPE_NONE, CLIP_TYPE_AUDIO_SAMPLE, CLIP_TYPE_AUDIO_AND_VIDEO, CLIP_TYPE_VIDEO];
export const AUDIO_BEHAVIOR_SCHEDULABLE = 'schedulable';
export const AUDIO_BEHAVIOR_SINGLE = 'single';
export const AUDIO_BEHAVIOR_TYPES = [AUDIO_BEHAVIOR_SCHEDULABLE, AUDIO_BEHAVIOR_SINGLE];

const BASE_AUDIO_SAMPLE = {
  gain: 1,
  behavior: AUDIO_BEHAVIOR_SCHEDULABLE,
  file: '',
  loop: true,
  track: 'master'
};

const BASE_VIDEO_SAMPLE = {
  noFilter: false
};

const BASE_AUDIO_VIDEO_SAMPLE = {
  ...BASE_AUDIO_SAMPLE,
  videoFile: ''
};

/**
 * -------------------- REDUCER ----------------------------
 */
export default function clips(state = {}, action) {
  const id = action.id;

  switch (action.type) {
    case CHANGE_CLIP_FIELD:
      const { field, value } = action;
      let clip = state[id];

      // make sure, the clip has the base values for its type
      if (clip && field === 'type') {
        switch (value) {
          case CLIP_TYPE_AUDIO_SAMPLE:
            clip = {
              ...BASE_AUDIO_SAMPLE,
              ...clip
            };
            break;
          case CLIP_TYPE_VIDEO:
            clip = {
              ...BASE_VIDEO_SAMPLE,
              ...clip
            };
            break;
          case CLIP_TYPE_AUDIO_AND_VIDEO:
            clip ={
              ...BASE_AUDIO_VIDEO_SAMPLE,
              ...clip
            };
            break;
          default:
        }

      }

      return {
        ...state,
        [id]: { ...clip, [field]: value }
      };
    case CREATE_CLIP:
      return {
        ...state,
        [id]: { id }
      }
    case DELETE_CLIP:
      const clipsCopy = { ...state };
      delete clipsCopy[id];
      return clipsCopy;
    default:
      return state;
  }
}

/**
 * -------------------- ACTION CREATORS ----------------------------
 */
export const changeClipField = (id, field, value) => ({ type: CHANGE_CLIP_FIELD, id, field, value });
export const createClip = (x, y, id, padId) => ({ type: CREATE_CLIP, x, y, id, padId });
export const deleteClip = (id, padId) => ({ type: DELETE_CLIP, id, padId });
