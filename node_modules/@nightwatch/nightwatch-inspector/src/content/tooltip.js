/* eslint-disable no-undef */

const nwTooltip = createTooltip();

function createTooltip() {
  //const eleCoordinates = element.getBoundingClientRect();
  const tooltip = document.createElement('span');
  tooltip.id = 'nw-tooltip';
  document.body.appendChild(tooltip);

  return tooltip;
}

function updateTooltipPosition(element = null, selector = '') {
  if (element === null) {
    nwTooltip.style.top = '0px';
    nwTooltip.style.left = '0px';
    nwTooltip.textContent = '';

    return;
  }

  // TODO: Should check if tootltip position is out of window (bottom of screen)
  const rect = element.getBoundingClientRect();
  nwTooltip.style.top = rect.bottom + window.pageYOffset + 10 + 'px';
  nwTooltip.style.left = rect.left + 'px';
  nwTooltip.textContent = selector;
  if (window.innerWidth - nwTooltip.getBoundingClientRect().right < 0) {
    nwTooltip.style.left = rect.left + window.innerWidth - nwTooltip.getBoundingClientRect().right + 'px';
  }
}
