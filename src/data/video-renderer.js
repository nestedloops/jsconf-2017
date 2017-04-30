/**
 * -------------------- ACTION TYPES ----------------------------
 */
const SET_RENDERPARAM = 'jsconf2017/video-renderer/SET_RENDERPARAM';

/**
 * -------------------- REDUCER ----------------------------
 */
const initialState = {
  renderParams: {
    resolution: "160x90",
    backgroundColor: 0x000000,
    foregroundColor: 0xe10079,
    pointSize: 0.25,
    luminanceMin: 0.2,
    luminanceMax: 0.9,
    r0: 0.9
  }
};
export default function videoRenderer(state = initialState, action) {
  switch (action.type) {
    case SET_RENDERPARAM:
      return {
        ...state,
        renderParams: {
          ...state.renderParams,
          ...action.renderParams
        }
      };

    default:
      return state;
  }
}

/**
 * -------------------- ACTION CREATORS ----------------------------
 */
export const setRenderparam = (name, value) => ({
  type: SET_RENDERPARAM,
  renderParams: {[name]: value}
});
