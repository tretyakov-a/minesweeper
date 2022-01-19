
import { renderTime } from './helpers';
import statisticsTemplate from '../templates/statistics/statistics.ejs';

const statisticsTab = document.querySelector('[data-tab="statistics"');
const statistics = loadFromLocalStorage();
const showModificator = 'statistics__block_show';
const numberOfLastGamesToShow = 10;

function updateStatistics({ difficulty, result, time }) {
  if (statistics[difficulty] === undefined) {
    statistics[difficulty] = [];
  }
  statistics[difficulty].push({
    date: Date.now(),
    result,
    time,
  });
  localStorage.setItem('statistics', JSON.stringify(statistics));
}

function loadFromLocalStorage() {
  const stats = localStorage.getItem('statistics');
  if (stats) {
    return JSON.parse(stats);
  }
  return {};
}

function findMinTime(difficulty) {
  const games = statistics[difficulty];
  if (!games) {
    return Infinity;
  }
  const wins = games.filter(game => game.result === 'win');
  return wins.length > 0 
    ? wins.reduce((min, game) => min > game.time ? game.time : min, wins[0].time) 
    : Infinity;
}

function toConverted({ date, time, result }) {
  return {
    date: new Date(date).toLocaleString(),
    time: renderTime(time),
    result
  };
}

function getStatisticsData(difficulty) {
  const games = statistics[difficulty];
  if (games.length === 0) {
    return null;
  }
  const wins = games.filter(game => game.result === 'win');
  const minTime = findMinTime(difficulty);
  
  return {
    difficulty,
    games: games.slice(-numberOfLastGamesToShow).map(toConverted).reverse(),
    active: difficulty === 'easy' ? showModificator : '',
    gamesNumber: games.length,
    wins: wins.length,
    loses: games.length - wins.length,
    bestTime: minTime !== Infinity ? renderTime(minTime) : 'No wins yet',
  };
}

function renderStatistics() {
  const blocks = Object.keys(statistics).map(getStatisticsData).filter(el => el !== null);
  return statisticsTemplate({ blocks });
}

function switchTab(btn) {
  const btns = statisticsTab.querySelectorAll('[data-block-name]');
  for (const btn of btns) {
    btn.classList.remove('statistics__button_active');
  }
  btn.classList.add('statistics__button_active');

  const blocks = statisticsTab.querySelectorAll('[data-name]');
  for (const block of blocks) {
    block.classList.remove('statistics__block_active');
    if (block.dataset.name === btn.dataset.blockName) {
      block.classList.add('statistics__block_active');
    }
  }
}

function handleStatisticsTabClick(e) {
  const btn = e.target.closest('[data-block-name]');
  if (btn) {
    switchTab(btn);
  }
}

function init() {
  statisticsTab.addEventListener('click', handleStatisticsTabClick);
}

export {
  init,
  updateStatistics,
  renderStatistics,
  findMinTime
}