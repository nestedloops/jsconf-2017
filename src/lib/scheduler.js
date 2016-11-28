import BeatClock from './beatclock';
import context from './audio/context';

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
} from '../data/buttons';

export default {
  store: null,
  beatClock: null,

  init(storeObject) {
    this.store = storeObject
    this.beatClock = new BeatClock();
    this.beatClock.on('bar', this.onBar.bind(this));
    this.beatClock.start();

    this.handleManualSchedule = this.handleManualSchedule.bind(this);
  },

  onBar() {
    const { buttons, fileLoader, scheduler: { scheduled, toStop } } = this.store.getState();

    Object.keys(scheduled).forEach((buttonId) => {
      const config = buttons[buttonId];
      const buffer = fileLoader[config.file];

      // file has not loaded
      if (!buffer) { return false; }

      this.playAudioNode(config);
    });

    Object.keys(toStop).forEach((buttonId) => {
      this.stopAudioNode(buttonId);
    });

    this.store.dispatch(flushScheduled());
  },

  handleManualSchedule(buttonId) {
    const { buttons, scheduler: { scheduled, playing } } = this.store.getState();
    const button = buttons[buttonId];
    const { behavior, id, loop } = button;

    if (behavior === AUDIO_BEHAVIOR_SINGLE) {
      if (!playing[id]) {
        this.playAudioNode(button);
      } else {
        if (loop) {
          this.stopAudioNode(id);
        } else {
          this.stopAudioNode(id);
          this.playAudioNode(button);
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

  playAudioNode({ file, loop, gain, id }) {
    const { fileLoader } = this.store.getState();
    const buffer = fileLoader[file];

    // file has not loaded
    if (!buffer) { return false; }

    const audioNode = context.createBufferSource();
    const gainNode = context.createGain();
    audioNode.buffer = buffer;
    audioNode.loop = loop;
    gainNode.gain.value = gain;
    audioNode.connect(gainNode);
    gainNode.connect(context.destination);
    audioNode.start();
    audioNode.onended = () => this.stopAudioNode(id);
    this.store.dispatch(addPlaying(id, audioNode));
  },

  stopAudioNode(buttonId) {
    const { scheduler: { playing } } = this.store.getState();
    const audioNode = playing[buttonId];
    saveAudioStop(audioNode);
    this.store.dispatch(audioEnded(buttonId));
  }
};

function saveAudioStop(audioNode) {
  try {
    audioNode.stop();
    audioNode.disconnect();
  } catch(e) {}
}
