/* eslint-disable no-undef */

/**
 * COMMANDS SUGGESTIONS 
 */

const input = document.getElementById('nightwatchCommand');
const suggestion = document.getElementById('suggestion');

window.onload = () => {
  input.value = 'browser.title()';
  clearSuggestion();
};

const clearSuggestion = () => {
  suggestion.innerHTML = '';
};

//Execute function on input
input.addEventListener('input', (e) => {
  clearSuggestion();
  const inputValue = input.value.split('.').at(-1);
  
  for (let i in words) {
    //check if input matches with any word in words array
    if (words[i].startsWith(inputValue) && input.value !== '' && inputValue !== '') {
      //display suggestion
      const suggestionValue = words[i].replace(inputValue, '');
      suggestion.innerHTML = input.value + suggestionValue;
      break;
    }
  }
});

//Complete predictive text on enter key
input.addEventListener('keydown', (e) => {
  //When user presses enter and suggestion exists
  if (e.keyCode === 39 && suggestion.innerText !== '') {
    e.preventDefault();
    input.value = suggestion.innerText;
    //clear the suggestion
    clearSuggestion();
  }
});
