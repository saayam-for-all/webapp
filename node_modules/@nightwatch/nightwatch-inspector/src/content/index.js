/* eslint-disable no-undef */

const highlightClassName = 'nw-highlight';

//Explore mode is not the default mode
let EXPLORE_MODE = false;

chrome.runtime.onMessage.addListener(handleMessages);

document.addEventListener('mouseover', mouseOver);
document.addEventListener('mouseout', mouseOut);
document.addEventListener('click', clickEvent, {capture: true});

function handleMessages(message) {
  const {action, content} = message;

  switch (action) {
    case 'EXPLORE_MODE':
      setExploreMode(content);
      break;

    case 'HIGHLIGHT_ELEMENT':
      highlightElement(content);
      break;
      
  }
}

function mouseOver(event) {
  if (!EXPLORE_MODE) {
    return;
  }

  const element = event.target;
  addHighlightClass(element);

  const uniqueSelector = generateSelector(element);
  updateTooltipPosition(element, uniqueSelector);
}

function mouseOut(event) {
  if (!EXPLORE_MODE) {
    return;
  }

  const element = event.target;

  clearHighlight(element);
  updateTooltipPosition();
}

function clickEvent(event) {
  if (!EXPLORE_MODE) {
    return;
  }

  disableClick(event);
  clearHighlight();
  const element = event.target;
  const uniqueSelector = generateSelector(element);

  chrome.runtime.sendMessage({
    from: 'contentJS',
    action: 'selector',
    content: uniqueSelector
  });
}

function setExploreMode(value) {
  EXPLORE_MODE = value;
}

function highlightElement(selector) {
  // clear all previous highlighted elements
  clearHighlight();
  const element = document.querySelector(selector);
  addHighlightClass(element);
}

function addHighlightClass(element) {
  // Adding css class to highlight the element
  element.classList.add(highlightClassName);
}

function clearHighlight(element = null) {
  if (element) {
    element.classList.remove(highlightClassName);

    return;
  }

  const highlightedElements = [...document.getElementsByClassName(highlightClassName)];

  highlightedElements.forEach((element) => {
    element.classList.remove(highlightClassName);
  });
}

function disableClick(event) {
  event.stopPropagation();
  event.preventDefault();
  event.stopImmediatePropagation();
}
