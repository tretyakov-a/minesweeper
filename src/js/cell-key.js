
// x - row index, y - col index
export default class CellKey {
  constructor(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      this.x = x;
      this.y = y;
    } else if (typeof x === 'string' && y === undefined) {
      this.value = x;
    }
  }

  get x() {
    return this._x;
  }

  set x(newX) {
    this._x = Number(newX);
  }

  get y() { 
    return this._y;
  }

  set y(newY) {
    this._y = Number(newY);
  }

  get value() {
    return `${this.x}-${this.y}`;
  }

  set value(newValue) {
    const [ x, y ] = newValue.split('-');
    this.x = x;
    this.y = y;
  }

  toString() {
    return this.value;
  }

  valueOf() {
    return this.value;
  }
}