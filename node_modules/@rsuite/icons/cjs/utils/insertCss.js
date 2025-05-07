"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "insertCss", {
    enumerable: true,
    get: function() {
        return insertCss;
    }
});
var containers = []; // Store container HTMLElement references
var styleElements = []; // Store {prepend: HTMLElement, append: HTMLElement}
// Function to create a <style> element with an optional nonce value
function createStyleElement(nonce) {
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.setAttribute('data-insert-css', 'rsuite-icons'); // Mark the element as inserted by insertCss
    // If a nonce is provided, set it on the style element
    if (nonce) {
        styleElement.setAttribute('nonce', nonce);
    }
    return styleElement;
}
function insertCss(css) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    // Determine if the style should be prepended or appended
    var position = options.prepend === true ? 'prepend' : 'append';
    // Use the provided container or default to the document head
    var container = options.container || document.querySelector('head');
    if (!container) {
        throw new Error('No container found to insert CSS.');
    }
    // Find the index of the container in the containers array
    var containerId = containers.indexOf(container);
    // If it's the first time encountering this container, initialize it
    if (containerId === -1) {
        containerId = containers.push(container) - 1;
        styleElements[containerId] = {};
    }
    // Try to retrieve the existing style element, or create a new one
    var styleElement;
    if (styleElements[containerId][position]) {
        styleElement = styleElements[containerId][position];
    } else {
        // Create a new style element with an optional nonce
        styleElement = createStyleElement(options.nonce);
        styleElements[containerId][position] = styleElement;
        if (position === 'prepend') {
            container.insertBefore(styleElement, container.firstChild);
        } else {
            container.appendChild(styleElement);
        }
    }
    // Remove potential UTF-8 BOM if css was read from a file
    if (css.charCodeAt(0) === 0xfeff) {
        css = css.slice(1);
    }
    // Insert the CSS into the <style> element
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText += css; // IE-specific
    } else {
        styleElement.textContent += css; // Standard approach
    }
    return styleElement;
}
