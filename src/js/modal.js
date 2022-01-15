
import { isClickOutside, renderTime } from './helpers';
import renderModalContent from '../templates/modal-content.ejs';
import { findMinTime } from './statistics';

const modal = document.querySelector('.game__modal');
const title = modal.querySelector('.modal__title');
const content = modal.querySelector('.modal__content');

const showModificator = 'modal_show';
const hideModificator = 'modal_hide';
const winModificator = 'modal_win';
const loseModificator = 'modal_lose';
const animationDuration = 400;


function renderContent(isWin, difficulty, time) {
  const oldBestTime = findMinTime(difficulty);
  const isNewBestTime = isWin && oldBestTime > time;

  return renderModalContent({
    isNewBestTime,
    oldBestTime: oldBestTime !== Infinity ? renderTime(oldBestTime) : 0,
    difficulty,
    time: renderTime(time)
  });
}

function showModal({ difficulty, result, time }) {
  const isWin = result === 'win';
  title.textContent = isWin ? 'You won!' : 'You lost!';
  content.innerHTML = renderContent(isWin, difficulty, time);
  const resultModificator = isWin ? winModificator : loseModificator;
  modal.classList.remove(winModificator, loseModificator);
  modal.classList.add(showModificator, resultModificator);
  setTimeout(() => {
    document.addEventListener('click', handleDocumentClick);
  });
}

function handleDocumentClick(e) {
  if (isClickOutside(e, ['game__modal'])
      || e.target.closest('.modal__close-btn')) {
    hideModal();
  }
}

function hideModal() {
  modal.classList.remove(showModificator);
  modal.classList.add(hideModificator);
  document.removeEventListener('click', handleDocumentClick);

  setTimeout(() => {
    modal.classList.remove(hideModificator);
  }, animationDuration)
}

export {
  showModal,
}