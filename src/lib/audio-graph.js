import context from './audio/context';
import _ from 'lodash';

export default {
  tracks: {},
  filters: {},
  storeObject: null,

  init(storeObject) {
    this.storeObject = storeObject;
    this.removeTrack = this.removeTrack.bind(this);

    this.previousTracks = {};
    storeObject.subscribe(() => {
      const { tracks } = this.storeObject.getState();
      if (this.previousTracks !== tracks) {
        this.synchronizeGraph();
        this.previousTracks = tracks;
      }
    });

    this.synchronizeGraph();
  },

  synchronizeGraph() {
    const { tracks } = this.storeObject.getState();
    const currentTrackIds = Object.keys(tracks);
    const previousTrackIds = Object.keys(this.previousTracks);

    if (previousTrackIds.length > currentTrackIds.length) {
      _.difference(previousTrackIds, currentTrackIds).forEach(this.removeTrack)
    }

    currentTrackIds.forEach((trackId) => {
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
  },

  removeTrack(trackId) {
    this.tracks[trackId].disconnect();
    delete this.tracks[trackId];
  }
}
