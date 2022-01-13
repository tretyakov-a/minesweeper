export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function renderNumber(n, len = 3) {
  const s = n.toString();
  
  return s.length < len ? '0'.repeat(len - s.length) + s : s;
}