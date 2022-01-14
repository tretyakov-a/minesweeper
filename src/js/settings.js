const settings = document.querySelector('.settings');

let handleDifficultyChange = null;

function handleSettingsChange(e) {
  switch(e.target.name) {
    case 'difficulty': changeDifficulty(e.target.value); break;
    case 'dark-theme': setDarkTheme(e.target.checked); break;
  }
}

function changeDifficulty(newDifficulty) {
  console.log(newDifficulty);
  if (handleDifficultyChange) {
    handleDifficultyChange(newDifficulty);
  }
}

function setDarkTheme(isDarkTheme) {
  console.log('Theme changed to dark: ', isDarkTheme);
  if (isDarkTheme) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

export default function init(onDifficultyChange) {
  handleDifficultyChange = onDifficultyChange;
  settings.querySelector('select[name="difficulty"]').addEventListener('change', handleSettingsChange);
  settings.querySelector('input[name="dark-theme"]').addEventListener('change', handleSettingsChange);
}
