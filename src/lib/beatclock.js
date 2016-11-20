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

    this.start = () => this.dilla.start();
    this.stop = () => this.dilla.stop();
  }

  _onTick = (event) => {
    const split = event.position.split('.');
    const tick = parseInt(split[2], 10);
    const beat = parseInt(split[1], 10);
    const bar = parseInt(split[0], 10);
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
