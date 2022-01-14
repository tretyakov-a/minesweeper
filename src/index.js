import './styles/index.scss';

import { options } from './js/constants';
import GameState from './js/game-state';
import GameField from './js/game-field';
import renderTopPanel from './templates/game-top-panel.ejs';
import Timer from './js/timer';
import { renderNumber } from './js/helpers';
import initMenuTabs from './js/menu-tabs';
import initSettings from './js/settings';

let currentDifficulty = 'easy';

const gameState = new GameState(options.difficulty[currentDifficulty]);
gameState.subscribe('win', handleWin);
gameState.subscribe('lose', handleLose);

const gameContainer = document.querySelector('.game');

gameContainer.insertAdjacentHTML('afterbegin', renderTopPanel());

const gameField = new GameField(options.difficulty[currentDifficulty], gameState);

const resetBtn = document.querySelector('.reset-btn');
const gameTimerLabel = document.querySelector('.game__timer-value');
const gameTimer = new Timer();
gameTimer.subscribe('change', updateTimerLabel);
gameState.subscribe('gamestart', gameTimer.start);

function updateTimerLabel(time) {
  gameTimerLabel.textContent = renderNumber(time);
}

const resetGame = (newDifficuty = 'easy') => {
  const difficulty = options.difficulty[newDifficuty];
  gameState.reset(difficulty);
  if (gameField.render()) {
    gameContainer.removeChild(gameField.render());
  }
  gameField.reset(difficulty);
  gameContainer.insertAdjacentElement('beforeend', gameField.render());
  gameTimer.reset();
  resetBtn.classList.remove('reset-btn_win', 'reset-btn_lose');
}

function handleWin() {
  gameTimer.stop();
  resetBtn.classList.add('reset-btn_win');
  gameField.handleWin();
  console.log('Its WIN');
}

function handleLose(data) {
  gameTimer.stop();
  resetBtn.classList.add('reset-btn_lose');
  gameField.handleLose(data);
  console.log('Its LOSE', data);
}

resetBtn.addEventListener('click', resetGame);

resetGame();
initMenuTabs();
initSettings(resetGame);