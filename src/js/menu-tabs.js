import { isClickOutside } from './helpers';

const tabs = document.querySelectorAll('[data-tab]');
const header = document.querySelector('.header');
const animationDuration = 400;

function handleMenuBtnClick(e) {
  const btn = e.target.closest('.button');

  if (btn) {
    if (btn.dataset.tabLink) {
      showTab(btn.dataset.tabLink);
    } else if (btn.classList.contains('menu-tabs__close-btn')) {
      hideTabs();
    }
  }
}

function hideTabs() {
  header.classList.replace('header_show', 'header_hide');
  setTimeout(() => {
    header.classList.remove('header_hide');
    showTab();
  }, animationDuration);
}

function showTab(tabName = '') {
  if (tabName !== '') {
    header.classList.add('header_show');
  }

  for (const tab of tabs) {
    tab.classList.remove('menu-tabs__item_show');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('menu-tabs__item_show');
    }
  }
}

function handleDocumentClick(e) {
  if (isClickOutside(e, ['header'])) {
    hideTabs();
  }
}

export default function init() {
  document.querySelector('.header').addEventListener('click', handleMenuBtnClick);
  document.addEventListener('click', handleDocumentClick);
}