const tabs = document.querySelectorAll('[data-tab]');
const menuTabs = document.querySelector('.menu-tabs');
const animationDuration = 400;

function handleMenuBtnClick(e) {
  const btn = e.target.closest('.button');

  if (btn) {
    if (btn.dataset.tabLink) {
      showTab(btn.dataset.tabLink);
    } else if (btn.classList.contains('menu-tabs__close-btn')) {
      menuTabs.classList.replace('menu-tabs_show', 'menu-tabs_hide');
      setTimeout(() => {
        menuTabs.classList.remove('menu-tabs_hide');
      }, animationDuration);
    }
  }
}

function showTab(tabName) {
  menuTabs.classList.add('menu-tabs_show');

  for (const tab of tabs) {
    tab.classList.remove('menu-tabs__item_show');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('menu-tabs__item_show');
    }
  }
}

export default function init() {
  document.querySelector('.header').addEventListener('click', handleMenuBtnClick);
}