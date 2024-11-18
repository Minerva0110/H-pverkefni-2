import { fetcher } from './lib/fetcher.js';
import { renderContentPage } from './lib/pages/content-page.js';
import { renderIndexPage } from './lib/pages/index-page.js';
import { renderSubpage } from './lib/pages/sub-page.js';

async function render(root, querystring) {
<<<<<<< HEAD
  const mainIndexJson = await fetcher('data/index.json');

  const params = new URLSearchParams(querystring);
  const type = params.get('type');
  const content = params.get('content');

  console.log(type, content);

  if (!type) {
    return renderIndexPage(root, mainIndexJson);
  }

  if (content) {
    return renderContentPage(root, mainIndexJson);
  }

  renderSubpage(root, mainIndexJson, type);
}

const root = document.querySelector('#app');

render(root, window.location.search);
=======
    console.log('Rendering started');
    
    const mainIndexJson = await fetcher('data/index.json');
    if (!mainIndexJson) {
        console.error('Failed to load mainIndexJson');
        return;
    }

    console.log('Fetched index.json:', mainIndexJson);
    
    const params = new URLSearchParams(querystring);
    const type = params.get('type'); // e.g., "html"
    const content = params.get('content'); // e.g., "lectures"

    root.innerHTML = '';

    const headerElement = document.createElement('header');
    headerElement.innerHTML = `<h1>${mainIndexJson.title}</h1>`;
    const footerElement = document.createElement('footer');
    footerElement.textContent = mainIndexJson.footer;

    root.appendChild(headerElement);
    root.appendChild(footerElement);

    console.log('Type:', type, 'Content:', content);

    if (!type) {
        console.log('Rendering Index Page');
        return renderIndexPage(root, mainIndexJson);
    }

    if (content) {
        console.log('Rendering Content Page');
        return renderContentPage(root, mainIndexJson);
    }

    console.log('Rendering Subpage');
    renderSubpage(root, mainIndexJson, type);
}

window.addEventListener('popstate', () => {
    render(document.querySelector('#app'), window.location.search);
});

document.addEventListener('DOMContentLoaded', () => {
    render(document.querySelector('#app'), window.location.search);
});
>>>>>>> 74e3a18a631adb15de63e9bbb4326bb2db5aaccd
