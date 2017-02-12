/**
 * -------------------- ACTION TYPES ----------------------------
 */
const CHANGE_SETTING = 'jsconf-2017/settings/CHANGE_SETTING';

/**
 * -------------------- REDUCER ----------------------------
 */
export default function settings(state = {}, action) {
  switch (action.type) {
    case CHANGE_SETTING:
      return {
        ...state,
        [action.settingId]: action.value
      };
    default:
      return state;
  }
}

/**
 * -------------------- ACTION CREATOR ----------------------------
 */
export const changeSetting = (settingId, value) => ({ type: CHANGE_SETTING, settingId, value });
