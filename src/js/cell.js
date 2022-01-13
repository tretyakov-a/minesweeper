import Emmiter from './emmiter';

export default class Cell extends Emmiter {
  constructor(key) {
    super();
    this.state = Cell.STATE_CLOSED;
    this.value = Cell.VALUE_EMPTY;
    this.key = key;
  }

  getKey () {
    return this.key.value;
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    if (this.value === Cell.VALUE_MINE) {
      if (newState === Cell.STATE_OPENED) {
        this.emit('mineOpened', this);
      }
      if (newState === Cell.STATE_FLAGGED) {
        this.emit('mineFlagged', 1);
      }
      if (newState === Cell.STATE_CLOSED) {
        this.emit('mineFlagged', -1);
      }
    }
    this._state = newState;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
  }

  get isOpened() {
    return this._state === Cell.STATE_OPENED;
  }

  get isClosed() {
    return this._state === Cell.STATE_CLOSED;
  }

  get isFlagged() {
    return this._state === Cell.STATE_FLAGGED;
  }

  get isNumber() {
    return Cell.isNumberValue(this._value);
  }

  get isEmpty() {
    return this._value === Cell.VALUE_EMPTY;
  }

  get isMined() {
    return this._value === Cell.VALUE_MINE;
  }
}

Cell.isNumberValue = (value) => {
  return value > 0  && value <= 8;
}

Cell.STATE_CLOSED = 0;
Cell.STATE_OPENED = 1;
Cell.STATE_FLAGGED = 2;
Cell.VALUE_EMPTY = 0;
Cell.VALUE_MINE = 9;
Cell.VALUE_N_1 = 1;
Cell.VALUE_N_2 = 2;
Cell.VALUE_N_3 = 3;
Cell.VALUE_N_4 = 4;
Cell.VALUE_N_5 = 5;
Cell.VALUE_N_6 = 6;
Cell.VALUE_N_7 = 7;
Cell.VALUE_N_8 = 8;
