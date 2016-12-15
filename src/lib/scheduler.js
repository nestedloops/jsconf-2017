import BeatClock from './beatclock';
import context from './audio/context';
import audioGraph from './audio-graph';

import {
  addPlaying,
  addScheduled,
  audioEnded,
  flushScheduled,
  scheduleStop
} from '../data/scheduler';

import {
  AUDIO_BEHAVIOR_SINGLE,
  AUDIO_BEHAVIOR_SCHEDULABLE
} from '../data/clips';

export default {
  store: null,
  beatClock: null,

  init(storeObject) {
    const { settings: { bpm }} = storeObject.getState();
    this.store = storeObject
    this.beatClock = new BeatClock();
    this.beatClock.on('bar', this.onBar.bind(this));
    this.beatClock.setBpm(bpm);
    this.beatClock.start();

    this.handleManualSchedule = this.handleManualSchedule.bind(this);
  },

  onBar() {
    const { clips, fileLoader, scheduler: { scheduled, toStop } } = this.store.getState();

    Object.keys(scheduled).forEach((clipId) => {
      const config = clips[clipId];
      const buffer = fileLoader[config.file];

      // file has not loaded
      if (!buffer) { return false; }

      this.playAudioNode(config);
    });

    Object.keys(toStop).forEach((clipId) => {
      this.stopAudioNode(clipId);
    });

    this.store.dispatch(flushScheduled());
  },

  handleManualSchedule(clipId) {
    const { clips, scheduler: { scheduled, playing } } = this.store.getState();
    const clip = clips[clipId];
    const { behavior, id, loop } = clip;

    if (behavior === AUDIO_BEHAVIOR_SINGLE) {
      if (!playing[id]) {
        this.playAudioNode(clip);
      } else {
        if (loop) {
          this.stopAudioNode(id);
        } else {
          this.stopAudioNode(id);
          this.playAudioNode(clip);
        }
      }
    } else if (behavior === AUDIO_BEHAVIOR_SCHEDULABLE) {
      if (playing[id]) {
        this.scheduleStopAudioNode(id);
      } else {
        if (!scheduled[id]) {
          this.scheduleAudioNode(id);
        }
      }

    }
  },

  scheduleAudioNode(id) {
    this.store.dispatch(addScheduled(id));
  },

  scheduleStopAudioNode(id) {
    this.store.dispatch(scheduleStop(id));
  },

  playAudioNode({ file, loop, gain, id, track }) {
    const { fileLoader } = this.store.getState();
    const buffer = fileLoader[file];
    const tracks = audioGraph.getTracks();
    const trackNode = tracks[track] || tracks['master'];

    // file has not loaded
    if (!buffer) { return false; }

    const audioNode = context.createBufferSource();
    const gainNode = context.createGain();
    audioNode.buffer = buffer;
    audioNode.loop = loop;
    gainNode.gain.value = gain;
    audioNode.connect(gainNode);
    gainNode.connect(trackNode);
    audioNode.start();
    audioNode.onended = () => this.stopAudioNode(id);
    this.store.dispatch(addPlaying(id, audioNode));
  },

  stopAudioNode(clipId) {
    const { scheduler: { playing } } = this.store.getState();
    const audioNode = playing[clipId];
    saveAudioStop(audioNode);
    this.store.dispatch(audioEnded(clipId));
  }
};

function saveAudioStop(audioNode) {
  try {
    audioNode.stop();
    audioNode.disconnect();
  } catch(e) {}
}
