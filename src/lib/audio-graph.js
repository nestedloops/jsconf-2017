import context from './audio/context';

export default {
  tracks: {},
  filters: {},
  storeObject: null,

  init(storeObject) {
    this.storeObject = storeObject;

    this.previousTracks = null;
    storeObject.subscribe(() => {
      const { tracks } = this.storeObject.getState();
      if (this.previousTracks !== tracks) {
        this.previousTracks = tracks;
        this.setUpGraph();
      }
    });

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
        this.tracks[trackId] = track;
      }
      track.gain.value = parseFloat(trackConfig.gain, 10);
    });
  },

  getTracks() {
    return this.tracks;
  }
}
