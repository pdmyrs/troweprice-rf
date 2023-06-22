import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const picture = block.querySelector('picture');

  block.innerHTML = `
    <div class="image-wrapper"></div>
    <div class="content-wrapper">
      <div class="content">
        <div class="pre"><p>${config.pre || ''}</p></div>
        <div class="title"><p>${config.title}</p></div>
        <div class="subtitle"><p>${config.subtitle || ''}</p></div>
      </div>
    </div>
  `;
  block.querySelector('.image-wrapper').replaceChildren(picture);
}
