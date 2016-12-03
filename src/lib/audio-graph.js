import context from './audio/context';

export default {
  tracks: {},
  filters: {},
  storeObject: null,

  init(storeObject) {
    this.storeObject = storeObject;

    this.setUpGraph();
  },

  setUpGraph() {
    const { tracks } = this.storeObject.getState();
    Object.keys(tracks).forEach((trackId) => {
      const trackConfig = tracks[trackId];
      let track = this.tracks[trackId];
      if (!track) {
        track = context.createGain();
        track.connect(context.destination);
      }
      track.gain.value = parseInt(trackConfig.gain, 10);
    });
  }
}
