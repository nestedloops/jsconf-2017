import BeatClock from './beatclock';
import context from './audio/context';

import {
  addPlaying,
  audioEnded,
  flushScheduled
} from '../data/scheduler';

export default {
  store: null,
  beatClock: null,

  init(storeObject) {
    this.store = storeObject
    this.beatClock = new BeatClock();
    this.beatClock.on('beat', this.onBeat.bind(this));

    this.beatClock.start();
  },

  onBeat() {
    const { buttons, fileLoader, scheduler: { scheduled, toStop } } = this.store.getState();

    Object.keys(scheduled).forEach((buttonId) => {
      const config = buttons[buttonId];
      const buffer = fileLoader[config.file];
      const audioNode = context.createBufferSource();
      const gainNode = context.createGain();
      audioNode.buffer = buffer;
      audioNode.loop = config.loop;
      gainNode.gain.value = config.gain;
      audioNode.connect(gainNode);
      gainNode.connect(context.destination);
      audioNode.start();
      audioNode.onended = () => {
        try {
          audioNode.stop();
          audioNode.disconnect();
        } catch(e) {}
        this.store.dispatch(audioEnded(buttonId));
      }
      this.store.dispatch(addPlaying(buttonId, audioNode));
    });

    this.store.dispatch(flushScheduled());

    Object.keys(toStop).forEach(() => {

    });
  }
};
