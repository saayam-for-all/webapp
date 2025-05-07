/* eslint-disable no-undef */

/**
 * Set explore mode
 */

const exploreModeId = 'exploreMode';

function clickOnExploreMode(event) {
  const checkBox = event.target;
  sendMessageToBackground('EXPLORE_MODE', checkBox.checked);
}

document.getElementById(exploreModeId).addEventListener('click', clickOnExploreMode);
