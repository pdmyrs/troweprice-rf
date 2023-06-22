import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 600px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav);
      nav.querySelector('button').focus();
    }
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 */
function toggleMenu(nav) {
  const expanded = nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Builds the hamburger menu Div.
 * @returns {HTMLDivElement}
 */
function buildBrand() {
  const brand = document.createElement('div');
  brand.classList.add('nav-brand');
  brand.innerHTML = `
    <img class="logo" src="/styles/images/bright-blue-logo.png" alt="T. Rowe Price Trusty logo">
    <img class="wordmark" src="/styles/images/wordmark-gray.png" alt="T. Rowe Price">
  `;
  return brand;
}

/**
 * Builds the hamburger menu Div.
 * @returns {HTMLDivElement}
 */
function buildHamburger() {
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');

  hamburger.innerHTML = `
      <button class="nav-hamburger-icon" aria-controls="nav" aria-label="Open navigation" tabindex="0">
        <span class="icon icon-hamburger"></span>
        <span class="icon icon-close"></span>
      </button>
    `;
  return hamburger;
}

/**
 * Builds the Sections menu Div
 *
 * @param {String} sectionsStr the sections nav elements as a string.
 * @returns {HTMLDivElement}
 */
function buildSections(sectionsStr) {
  const tmp = document.createElement('div');
  tmp.innerHTML = sectionsStr;
  const ul = tmp.querySelector('ul');

  const sections = document.createElement('div');
  sections.classList.add('nav-sections');
  sections.append(ul);
  return sections;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const sections = await resp.text();

    // decorate nav DOM
    block.innerHTML = `
      <div class="nav-wrapper">
        <nav id="nav" aria-expanded="${isDesktop.matches}">
          <div class="nav-banner"></div>
        </nav> 
      </div>
    `;
    const nav = block.querySelector('nav');
    const banner = nav.querySelector('.nav-banner');
    const hamburger = buildHamburger();
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(nav);
    });

    banner.append(buildBrand());
    banner.append(hamburger);
    nav.append(buildSections(sections));
    isDesktop.addEventListener('change', () => toggleMenu(nav));

    await decorateIcons(block);
  }
}
