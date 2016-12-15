import context from './audio/context';
import Dilla from 'dilla';
import EventEmitter from 'event-emitter';

class BeatClock {
  constructor () {
    this.events = new EventEmitter();

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

  on() {
    this.events.on.apply(this.events, arguments);
  }

  setBpm(bpm) {
    this.dilla.setTempo(bpm);
  }

  _onTick = (event) => {
    const split = event.position.split('.');
    const tick = parseInt(split[2], 10);
    const beat = parseInt(split[1], 10);
    const bar = parseInt(split[0], 10);
    if (this.lastBar !== bar) {
      this.events.emit('bar', bar);
    }
    this.lastBar = bar;

    if (this.lastBeat !== beat) {
      this.events.emit('beat', tick, beat, bar);
    }
    this.lastBeat = beat;

    if (this.lastTick !== tick) {
      this.events.emit('tick', tick, beat, bar);
    }
    this.lastTick = tick;
  };
}

export default BeatClock;
