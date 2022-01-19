
import { renderTime } from './helpers';
import statisticsTemplate from '../templates/statistics.ejs';

const statistics = loadFromLocalStorage();

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

function getStatisticsData(difficulty) {
  const games = statistics[difficulty];
  if (games.length === 0) {
    return '';
  }
  const wins = games.filter(game => game.result === 'win');
  const minTime = findMinTime(difficulty);
  return {
    difficulty,
    gamesNumber: games.length,
    wins: wins.length,
    loses: games.length - wins.length,
    bestTime: minTime !== Infinity ? renderTime(minTime) : 'No wins yet',
  };
}

function renderStatisticsBlock(difficulty) {
  return statisticsTemplate(
    getStatisticsData(difficulty)
  );
}

function renderStatistics() {
  const data = Object.keys(statistics).map(renderStatisticsBlock);
  return data.join('');
}

export {
  updateStatistics,
  renderStatistics,
  findMinTime
}