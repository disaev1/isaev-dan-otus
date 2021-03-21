/* eslint-disable arrow-parens */

function getContribution(el) {
  if (el.id) {
    return `#${el.id}`;
  }

  if (el.classList.length) {
    const classes = Array.from(el.classList);

    return classes.map(className => `.${className}`).join('');
  }

  return el.tagName.toLowerCase();
}

function getPath(el) {
  let cumulative = [{ element: el, contribution: getContribution(el) }];
  let currentEl = el.parentElement;

  while (document.querySelectorAll(getCumulativeSelector(cumulative)).length > 1) {
    if (currentEl === document.body) {
      break;
    } else {
      cumulative = [{ element: currentEl, contribution: getContribution(currentEl) }, ...cumulative];
    }

    currentEl = currentEl.parentElement;
  }

  const matched = document.querySelectorAll(getCumulativeSelector(cumulative));
  console.log({ matched, cumulative });
  if (matched.length > 1) {
    for (let i = cumulative.length - 1; i >=0; i--) {
      const elSiblingIndex = getSiblingIndex(cumulative[i].element);
      cumulative[i].siblingIndex = elSiblingIndex;

      const newSelector = getCumulativeSelector(cumulative);
      const matched = document.querySelectorAll(newSelector);

      if (matched.length === 1) {
        return newSelector;
      }
    }
  }

  return getCumulativeSelector(cumulative);
}

function getSiblingIndex(el) {
  const parent = el.parentElement;

  return Array.from(parent.children).findIndex(child => child === el);
}

function getCumulativeSelector(cumulative) {
  return cumulative.map(item => {
    if (item.siblingIndex) {
      return `${item.contribution}:nth-child(${item.siblingIndex + 1})`;
    }

    return item.contribution;
  }).join(' > ');
}