import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();

    // create footer container
    const footerWrapper = document.createElement('div');
    footerWrapper.classList.add('footer-content-wrapper');

    // first div is the icon
    const iconDiv = html.querySelector('div > div');
    iconDiv.classList.add('footer-icon');
    footerWrapper.append(iconDiv);

    // disclaimer container
    const disclaimerWrapper = document.createElement('div');
    disclaimerWrapper.classList.add('footer-disclaimer-wrapper');

    // last div is the disclaimer
    const disclaimerDiv = html.querySelector('div > div:last-child');
    disclaimerDiv.classList.add('footer-disclaimer-content');
    disclaimerWrapper.append(disclaimerDiv);

    // footer main content
    const footerMain = document.createElement('div');
    footerMain.classList.add('footer-main-content');
    footerWrapper.append(footerMain);

    // content divs
    const footerDataSections = html.querySelectorAll('div > div');
    footerDataSections.forEach((section) => {
      footerMain.append(section);
    });

    decorateIcons(footerWrapper);

    block.append(footerWrapper);
    block.append(disclaimerWrapper);
  }
}
