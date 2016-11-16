const CHANGE_BUTTON_FIELD = 'jsconf2017/buttons/CHANGE_BUTTON_FIELD';
export const CREATE_BUTTON = 'jsconf2017/buttons/CREATE_BUTTON';

export const BUTTON_TYPE_NONE = 'select a type';
export const BUTTON_TYPE_AUDIO_SAMPLE = 'audiosample';
export const BUTTON_TYPE_VIDEO = 'video';
export const BUTTON_TYPES = [BUTTON_TYPE_NONE, BUTTON_TYPE_AUDIO_SAMPLE, BUTTON_TYPE_VIDEO];
export const AUDIO_BEHAVIOR_SINGLE = 'single';
export const AUDIO_BEHAVIOR_SCHEDULABLE = 'schedulable';
export const AUDIO_BEHAVIOR_TYPES = [AUDIO_BEHAVIOR_SINGLE, AUDIO_BEHAVIOR_SCHEDULABLE];

const BASE_AUDIO_SAMPLE = {
  gain: 1,
  behavior: 'single',
  file: ''
};

export default function buttons(state = {}, action) {
  const id = action.id;

  switch (action.type) {
    case CHANGE_BUTTON_FIELD:
      const { field, value } = action;
      let button = state[id];

      // make sure, the button has the base values for its type
      if (button && field === 'type' && value === BUTTON_TYPE_AUDIO_SAMPLE) {
        button = {
          ...BASE_AUDIO_SAMPLE,
          ...button
        };
      }

      return {
        ...state,
        [id]: { ...button, [field]: value }
      };
    case CREATE_BUTTON:
      return {
        ...state,
        [id]: { id }
      }
    default:
      return state;
  }
}

export const changeButtonField = (id, field, value) => ({ type: CHANGE_BUTTON_FIELD, id, field, value });
export const createButton = (x, y, id) => ({ type: CREATE_BUTTON, x, y, id });
