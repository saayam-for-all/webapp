/* eslint-disable no-undef */

/**
 * ADD ROW TO SELECTOR HISTORY IN EXPLORE MODE
 */

function getSelectorFromFirstCell(event) {
  const targetElement = event.target.parentElement.parentElement.firstElementChild;

  return targetElement.textContent;
}

function clickOnCopy(event) {
  // Info: clipboard API not working. Using deprecated execCommand function
  const selectorValue = getSelectorFromFirstCell(event);
  const textarea = document.createElement('textarea');

  textarea.textContent = selectorValue;
  document.body.appendChild(textarea);
  textarea.select();

  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function clickOnHighlight(event) {
  const selectorValue = getSelectorFromFirstCell(event);

  sendMessageToBackground('HIGHLIGHT_ELEMENT', selectorValue);
}

function addRow(selector) {
  const selectorTable = document.getElementById('selectorTable');
  const tbody = selectorTable.getElementsByTagName('tbody')[0];
  const newRow = tbody.insertRow(0);
  
  const highlightButton = document.createElement('button');
  highlightButton.classList.add('button-default');
  highlightButton.appendChild(document.createTextNode('Highlight'));
  highlightButton.addEventListener('click', clickOnHighlight);
  
  const copyButton = document.createElement('button');
  copyButton.classList.add('button-default');
  copyButton.appendChild(document.createTextNode('Copy'));
  copyButton.addEventListener('click', clickOnCopy);
  
  var newCell = newRow.insertCell();
  newCell.style.width = '65%';
  newCell.appendChild(document.createTextNode(selector));
  
  newCell = newRow.insertCell();
  newCell.style.width = '35%';
  newCell.appendChild(highlightButton);
  newCell.appendChild(copyButton);
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  const {from, action, content} = msg;
  if (sender.tab.id === tabID && from === 'contentJS') {
    switch (action) {
      case 'selector':
        addRow(content);
        break;
    }
  }
});

