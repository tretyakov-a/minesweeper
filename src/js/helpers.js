export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function renderNumber(n) {
  const sMaxLength = 3;
  const s = n.toString();
  
  return s.length < sMaxLength ? '0'.repeat(sMaxLength - s.length) + s : s;
}