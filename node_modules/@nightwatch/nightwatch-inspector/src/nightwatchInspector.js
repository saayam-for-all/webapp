// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
chrome.devtools.panels.create('Nightwatch Inspector', null, 'panel/index.html', function() {});
