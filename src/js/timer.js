import Emitter from './emmiter';
import { renderNumber } from './helpers';

export default class Timer extends Emitter {

  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.isRunning = false;
    this.startTime = 0;
    this.endTime = 0;
    this.prevTime = 0;
    this.secondsCounter = 0;
    this._emitChange();
  }

  _emitChange() {
    this.emit('change', this.secondsCounter);
  }

  start() {
    this.isRunning = true;
    this.startTime = Date.now();
    this.prevTime = this.startTime;

    const checkTime = () => {
      if (this.isRunning) {
        const currTime = Date.now();
        const dt = currTime - this.prevTime;
        if (dt >= 1000) {
          this.secondsCounter += 1;
          this.prevTime = currTime;
          this._emitChange();
        }
        requestAnimationFrame(checkTime);
      }
    }
    checkTime();
  }

  stop() {
    this.isRunning = false;
    this.endTime = Date.now();
    this.getGameTime();
  }

  getGameTime() {
    const time = this.endTime - this.startTime;
    const ms = renderNumber(time % 1000, 3);
    const min = renderNumber(Math.floor(time / 1000 / 60), 2);
    const sec = renderNumber(Math.floor(time / 1000) - min * 60, 2);
    console.log(`${min}:${sec}:${ms}`);
  }
}
