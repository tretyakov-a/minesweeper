import './styles/index.scss';

import { options } from './js/constants';
import GameState from './js/game-state';
import GameField from './js/game-field';
import renderTopPanel from './templates/game-top-panel.ejs';

const currentDifficulty = options.difficulty.easy;

const gameState = new GameState(currentDifficulty);
gameState.subscribe('win', handleWin);
gameState.subscribe('lose', handleLose);

const gameContainer = document.querySelector('.game');

gameContainer.insertAdjacentHTML('afterbegin', renderTopPanel());

const gameField = new GameField(currentDifficulty, gameState);
// gameContainer.insertAdjacentElement('beforeend', gameField.render());

const resetBtn = document.querySelector('.reset-btn');

resetBtn.addEventListener('click', resetGame);

resetGame();

function resetGame() {
  gameState.clearState();
  if (gameField.render()) {
    gameContainer.removeChild(gameField.render());
  }
  gameField.reset();
  gameContainer.insertAdjacentElement('beforeend', gameField.render());
  resetBtn.classList.remove('reset-btn_win', 'reset-btn_lose');
}

function handleWin() {
  resetBtn.classList.add('reset-btn_win');
  console.log('Its WIN');
}

function handleLose(data) {
  resetBtn.classList.add('reset-btn_lose');
  console.log('Its LOSE', data);
  gameField.handleLose(data);
}