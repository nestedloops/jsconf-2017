import context from './audio/context';
import Dilla from 'dilla';
import EventEmitter from 'event-emitter';

class BeatClock extends EventEmitter {
  constructor () {
    super();

    this.dilla = Dilla(context, {
      tempo: 100,
      beatsPerBar: 4,
      loopLength: 2
    });

    this.dilla.on('tick', this._onTick);
  }

  start() {
    this.dilla.start();
  }

  stop() {
    this.dilla.stop();
  }

  _onTick = (tick) => {
    const split = tick.position.split('.');
    const tick = parseInt(split[2]);
    const beat = parseInt(split[1]);
    const bar = parseInt(split[0]);
    if (this.lastBar !== bar) {
      this.emit('bar', bar);
    }
    this.lastBar = bar;

    if (this.lastBeat !== beat) {
      this.emit('beat', tick, beat, bar);
    }
    this.lastBeat = beat;

    if (this.lastTick !== tick) {
      this.emit('tick', tick, beat, bar);
    }
    this.lastTick = tick;
  };
}

export default BeatClock;
