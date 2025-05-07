/* eslint-disable no-undef */

/**
 * Click Selector Priority
 * 
 * User facing attributes has prioritised over css and xpath :
 * 
 * 1. Data-* attributes
 * 2. Role based selectors
 * 3. Label based selector for form fields
 * 4. Element specific selectors
 * 5. Text - div, span, p, h
 * 6. Img - alt text
 * 7. Area - alt text
 * 8. ID - less prone to changes
 * 9. Class - prone to changes
 */

function getAttributeSelectors(element) {
  const attributes = [...element.attributes];
  const attributesToConsider = ['placeholder', 'name', 'type', 'alt', 'value', 'for', 'title', 'id', 'lang', 'href'];

  return attributes.reduce((prev, next) => {
    const attributesName = next.nodeName.toLowerCase();
    const attributesValue = next.value;
    if (attributesName.startsWith('data-') || attributesName.startsWith('aria-')) {
      if (attributesValue) {
        prev.unshift(`[${attributesName}="${attributesValue}"]`);
      }
    }

    if (attributesToConsider.indexOf(attributesName) > -1) {
      if (attributesValue) {
        prev.push(`[${attributesName}="${attributesValue}"]`);
      }
    }

    return prev;
  }, []);

}

function getClassSelectors(element) {
  const classList = [...element.classList].filter((Class) => Class !== highlightClassName);

  return classList.map(Class => `.${Class}`);
}

function getIdSelectors(element) {
  const id = element.getAttribute('id');
  if (id && id !== '') {
    return `#${id}`;
  }

  return null;
}

function getChildIndex(element) {
  return Array.from(element.parentNode.children).indexOf(element) + 1;
}

function getCssPath(element) {
  const tagName = getTag(element);

  return `${tagName}:nth-child(${getChildIndex(element)})`;
}

function getTag(element) {
  return element.tagName.toLowerCase();
}

function getCombinations(selectors) {
  const combinations = [...selectors];

  for (let i=0; i < selectors.length-1; i++) {
    for (let j=i+1; j < selectors.length; j++) {
      combinations.push(selectors[i] + selectors[j]);
    }
  }

  return combinations;
}

function isUniqueInParent(element, selector) {
  const {parentNode = null} = element;
  try {
    const elements = parentNode.querySelectorAll(selector);

    return elements.length === 1;
  } catch (e) {
    return false;
  }
}

function chooseFirstUniqueSelector(element, selectors) {
  for (const selector of selectors) {
    if (isUnique(selector)) {
      return selector;
    }
  }
  // select unique selector in its parent children
  for (const selector of selectors) {
    if (isUniqueInParent(element, selector)) {
      return selector;
    }
  }

  return null;
}

function getUniqueCombination(element, selectors, tagName) {
  let combinations = getCombinations(selectors);

  combinations = combinations.map(combination => tagName + combination);
  const uniqueFirstSelector = chooseFirstUniqueSelector(element, combinations);

  if (uniqueFirstSelector) {
    return uniqueFirstSelector;
  }

  return null;
}

function isUnique(selector) {
  try {
    const elements = document.querySelectorAll(selector);

    return elements.length === 1;
  } catch (e) {
    return false;
  }
}

function generateSelectorFromParent(element) {
  const attributesSelectors = getAttributeSelectors(element);
  const classSelectors = getClassSelectors(element);
  const cssPath = getCssPath(element);
  const tagName = getTag(element);

  let selector = getUniqueCombination(element, attributesSelectors, tagName);

  if (selector) {
    return selector;
  }

  selector = getUniqueCombination(element, classSelectors, tagName);

  if (selector) {
    return selector;
  }

  if (cssPath) {
    return cssPath;
  }

  return '*';

}

function getParentElement(element) {
  if (element.parentNode) {
    return element.parentNode;
  }

  return null;
}

function generateSelector(element) {
  let targetElement = element;
  let uniqueSelector = generateSelectorFromParent(targetElement);
  const selectors = [uniqueSelector];

  while (!isUnique(uniqueSelector)) {
    targetElement = getParentElement(targetElement);
    selectors.unshift(generateSelectorFromParent(targetElement));
    uniqueSelector = selectors.join(' > ');
  }
  
  return uniqueSelector;
}
