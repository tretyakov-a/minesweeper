import { isClickOutside } from './helpers';
import { renderStatistics } from './statistics';

const tabs = document.querySelectorAll('[data-tab]');
const header = document.querySelector('.header');
const animationDuration = 400;

function handleMenuBtnClick(e) {
  console.log('wtf', e)
  const btn = e.target.closest('.button');

  if (btn && btn.dataset.tabLink) {
    showTab(btn.dataset.tabLink);
  }
}

function hideTabs() {
  header.classList.replace('header_show', 'header_hide');
  setTimeout(() => {
    header.classList.remove('header_hide');
    showTab();
  }, animationDuration);
  document.removeEventListener('click', handleDocumentClick); 
}

function showTab(tabName = '') {
  if (tabName !== '') {
    header.classList.add('header_show');
  }

  for (const tab of tabs) {
    tab.classList.remove('menu-tabs__item_show');
    if (tab.dataset.tab === tabName) {
      if (tabName === 'statistics') {
        const html = renderStatistics();
        tab.querySelector('.menu-tabs__content').innerHTML = html;
      }
      tab.classList.add('menu-tabs__item_show');
    }
  }
  setTimeout(() => {
    document.addEventListener('click', handleDocumentClick); 
  });
}

function handleDocumentClick(e) {
  if (isClickOutside(e, ['header'])
      || e.target.closest('.menu-tabs__close-btn')) {
    hideTabs();
  }
}

export default function init() {
  document.querySelector('.header').addEventListener('click', handleMenuBtnClick);
}