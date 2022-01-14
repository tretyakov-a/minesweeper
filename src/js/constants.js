const options = {
  difficulty: {
    easy: {
      mines: 10,
      width: 9,
      height: 9
    },
    medium: {
      mines: 40,
      width: 16,
      height: 16
    },
    expert: {
      mines: 99,
      width: 30,
      height: 16
    },
  }
}

const GAME_FIELD_CLASS = 'game-field';
const CELL_CLASS = `${GAME_FIELD_CLASS}__cell`;

const setModificator = name => `${CELL_CLASS}_${name}`;

const CELL_MODIFICATORS = {
  closed: setModificator('closed'),
  flagged: setModificator('flagged'),
  wronglyFlagged: setModificator('wrongly-flagged'),
  empty: setModificator('empty'),
  mine: setModificator('mine'),
  mineBlowned: setModificator('mine-blowned'),
  number: setModificator('number-'),
  highlighted: setModificator('highlighted'),
};

const MOUSE = {
  LEFT: 0,
  RIGHT: 2,
};

export {
  options,
  GAME_FIELD_CLASS,
  CELL_CLASS,
  CELL_MODIFICATORS,
  MOUSE
}