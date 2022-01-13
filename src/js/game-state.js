import { randomNumber } from './helpers';
import Cell from './cell';
import CellKey from './cell-key';
import Emmiter from './emmiter';

const checks = {
  topLeft: [-1, -1],
  top: [-1, 0],
  topRight: [-1, 1],
  left: [0, -1],
  right: [0, 1],
  bottomLeft: [1, -1],
  bottom: [1, 0],
  bottomRight: [1, 1]
};

export default class GameState extends Emmiter {
  constructor(difficulty, onWin, onLose) {
    super();
    this.difficulty = difficulty;
    this.onWin = onWin;
    this.onLose = onLose;
    this.isGameStart = false;
    this.flagsCounter = this.difficulty.mines;
    // this.clearState();
  }

  getCell = (cellKey) => {
    if (!this._checkCell(cellKey)) {
      return undefined;
    }
    return this.state[cellKey.x][cellKey.y];
  }

  _checkCell = (cellKey) => {
    return this.state[cellKey.x] !== undefined && this.state[cellKey.x][cellKey.y] !== undefined
  };

  flagCell = (cellKey) => {
    const cell = this.getCell(cellKey);
    if (cell.isOpened) {
      return;
    }
    if (cell.isFlagged) {
      this.flagsCounter += 1;
      cell.state = Cell.STATE_CLOSED;
    } else {
      this.flagsCounter -= 1;
      cell.state = Cell.STATE_FLAGGED
    }
    this.checkStateForWin();
    return this.flagsCounter;
  }

  reveal = (cellKey) => {
    const openCell = (cellKey) => {
      const cell = this.getCell(cellKey);
      if (cell.isFlagged || (cell.isOpened && (cell.isMined || cell.isEmpty))) {
        return;
      }
  
      if (cell.isOpened && cell.isNumber) {
        const cells = this.getHighlightedCells(cellKey);
        if (cells.length === 0 || cell.value > this.countFlagsAround(cellKey)) {
          return;
        }
        cells.forEach(openCell);
        return;
      }
  
      cell.state = Cell.STATE_OPENED;
  
      if (cell.isEmpty) {
        this._revealEmptySpace(cellKey);
      }
    }

    openCell(cellKey);
    this.checkStateForWin();
  }

  checkStateForWin = () => {
    let foundMinesCounter = 0;
    let checkedCellsCounter = 0;

    for (let rowIdx = 0; rowIdx < this.state.length; rowIdx += 1) {
      for (let colIdx = 0; colIdx < this.state[rowIdx].length; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const cell = this.getCell(cellKey);
        checkedCellsCounter += 1;
        // if (cell.isOpened && cell.isMined) {
        //   return this.handleLose(cellKey);
        // }
        if (cell.isClosed && cell.isMined) {
          console.log(checkedCellsCounter);
          return;
        }
        if (cell.isFlagged && cell.isMined) {
          foundMinesCounter += 1;
        }
      }
    }
    console.log(checkedCellsCounter, 'MINES=', foundMinesCounter);
    if (foundMinesCounter === this.difficulty.mines) {
      this.emit('win');
    }
  }

  handleLose = (data) => {
    this.emit('lose', {
      mineKey: data,
      wrongFlagsKeys: this._findWrongFlags(),
    });
  }

  countFlagsAround = (cellKey) => {
    return Object.values(checks)
      .reduce((counter, [dx, dy]) => {
        const newCellKey = new CellKey(cellKey.x + dx, cellKey.y + dy);
        const cell = this.getCell(newCellKey);
        return counter + (cell ? cell.isFlagged : 0);
      }, 0);
  }

  getHighlightedCells = (cellKey) => {
    return Object.values(checks)
      .reduce((cells, [dx, dy]) => {
        const newCellKey = new CellKey(cellKey.x + dx, cellKey.y + dy);
        const cell = this.getCell(newCellKey);
        if (cell && cell.isClosed) {
          cells.push(newCellKey);
        }
        return cells;
      }, []);
  }

  setDifficulty = (newDifficulty) => {
    this.difficulty = newDifficulty;
  }

  generateState = (cellKey) => {
    this.isGameStart = true;
    this._generateMines(cellKey);
    this._generateNumbers();
  }

  clearState = (newDifficulty) => {
    if (newDifficulty !== undefined) {
      this.difficulty = newDifficulty;
    }
    this.isGameStart = false;
    this.flagsCounter = this.difficulty.mines;
    this.state = this._generateInitialMatrix();
  }

  _findWrongFlags = () => {
    const wrongFlagsKeys = [];
    for (let rowIdx = 0; rowIdx < this.state.length; rowIdx += 1) {
      for (let colIdx = 0; colIdx < this.state[rowIdx].length; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const cell = this.getCell(cellKey);
        if (cell.isFlagged && !cell.isMined) {
          wrongFlagsKeys.push(cellKey);
        }
      }
    }
    return wrongFlagsKeys;
  }

  _revealEmptySpace = (startCellKey) => {
    const reveal = (key, startCellKey) => {
      const [ dx, dy ] = checks[key];
      const newCellKey = new CellKey(startCellKey.x + dx, startCellKey.y + dy);
      
      const cell = this.getCell(newCellKey);
      if (!cell || cell.isOpened || cell.isFlagged) {
        return;
      }
      if (cell.isNumber) {
        cell.state = Cell.STATE_OPENED;
        return;
      }
      if (cell.isEmpty) {
        cell.state = Cell.STATE_OPENED;
        Object.keys(checks).forEach(checkKey => reveal(checkKey, newCellKey))
      }
    }

    Object.keys(checks).forEach(key => reveal(key, startCellKey));
  };

  _generateInitialMatrix = () => {
    const { width, height } = this.difficulty;
    const matrix = [];
    for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
      matrix.push(new Array(width).fill(null));
      for (let colIdx = 0; colIdx < width; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        matrix[rowIdx][colIdx] = new Cell(cellKey);
      }
    }
    return matrix;
  }
  
  _generateMines = (excludedCellKey) => {
    const { mines: minesNumber, width, height } = this.difficulty;
    const mines = {};
    for (let k = 0; k < minesNumber; k += 1) {
      let newCellKey;
      do {
        newCellKey = new CellKey(
          randomNumber(0, height),
          randomNumber(0, width)
        )
      } while (mines[newCellKey.value] || newCellKey.value === excludedCellKey.value);
      mines[newCellKey.value] = 1;
      const cell = this.getCell(newCellKey);
      cell.value = Cell.VALUE_MINE;
      cell.subscribe('mineOpened', this.handleLose);
    }
  }

  _countNeighboringMines = (cellKey) => {
    return Object.values(checks)
      .reduce((counter, [ dx, dy ]) => {
        const newCellKey = new CellKey(cellKey.x + dx, cellKey.y + dy);
        const cell = this.getCell(newCellKey);
        return counter + (cell ? cell.isMined : 0);
      }, 0);
  }

  _generateNumbers = () => {
    for (let rowIdx = 0; rowIdx < this.state.length; rowIdx += 1) {
      for (let colIdx = 0; colIdx < this.state[rowIdx].length; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const cell = this.getCell(cellKey);
        if (!cell.isMined) {
          const value = this._countNeighboringMines(cellKey);
          cell.value = value;
        }
      }
    }
  }
}