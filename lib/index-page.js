import { renderNavigation } from './navigation';
import { el } from '../../../elements';

export function renderIndexPage(root, indexJson) {
  console.log('rendering', root, indexJson.title);

  const headerElement = el('header', {}, el('h1', {}, indexJson.title));

  headerElement.appendChild(renderNavigation(indexJson.navigation));

  const mainElement = el(
    'main',
    {},
    el(
      'section',
      {},
      el('p', {}, indexJson.description),
      renderNavigation(indexJson.navigation),
    ),
  );
  const footerElement = el('footer', {}, indexJson.footer);

  root.appendChild(headerElement);
  root.appendChild(mainElement);
  root.appendChild(footerElement);
}