function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function renderNumber(n, len = 3) {
  const s = n.toString();
  
  return s.length < len ? '0'.repeat(len - s.length) + s : s;
}

function isClickOutside(e, classNames) {
  return classNames.every(className => !e.path.find(el => {
    return el.classList && el.classList.contains(className);
  }));
}


function renderTime(timeMs) {
  const ms = renderNumber(timeMs % 1000, 3);
  const min = renderNumber(Math.floor(timeMs / 1000 / 60), 2);
  const sec = renderNumber(Math.floor(timeMs / 1000) - min * 60, 2);
  return `${min}:${sec}:${ms}`;
}

export {
  randomNumber,
  renderNumber,
  isClickOutside,
  renderTime
}