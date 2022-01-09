
export default class Cell {
  constructor() {
    this.state = Cell.STATE_CLOSED;
    this.value = Cell.VALUE_EMPTY;
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    this._state = newState;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
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
