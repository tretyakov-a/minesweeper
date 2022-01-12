import './styles/index.scss';

import { options } from './js/constants';
import GameState from './js/game-state';
import GameField from './js/game-field';
import renderTopPanel from './templates/game-top-panel.ejs';

const currentDifficulty = options.difficulty.easy;

const gameState = new GameState(currentDifficulty, handleWin, handleLose);

const gameField = new GameField(currentDifficulty, gameState);

const gameContainer = document.querySelector('.game');

gameContainer.insertAdjacentElement('afterbegin', gameField.render());
gameContainer.insertAdjacentHTML('afterbegin', renderTopPanel());

const resetBtn = document.querySelector('.reset-btn');
resetBtn.addEventListener('click', resetGame);

function resetGame() {

}

function handleWin() {

}

function handleLose() {

}