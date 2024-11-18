import { fetcher } from './lib/fetcher.js';
import { renderContentPage } from './lib/pages/content-page.js';
import { renderIndexPage } from './lib/pages/index-page.js';
import { renderSubpage } from './lib/pages/sub-page.js';
import { renderFlashcardsPage } from './lib/pages/flashcards-page.js'; // Nýr import fyrir Flashcards

async function render(root, querystring) {
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
    const page = params.get('page'); // Nýtt: e.g., "flashcards"

    root.innerHTML = ''; // Clear previous content

    const headerElement = document.createElement('header');
    headerElement.innerHTML = `<h1>${mainIndexJson.title}</h1>`;
    const footerElement = document.createElement('footer');
    footerElement.textContent = mainIndexJson.footer;

    root.appendChild(headerElement);
    root.appendChild(footerElement);

    console.log('Type:', type, 'Content:', content, 'Page:', page);

    if (!type && !page) {
        console.log('Rendering Index Page');
        return renderIndexPage(root, mainIndexJson);
    }

    if (page === 'flashcards') {
        console.log('Rendering Flashcards Page');
        return renderFlashcardsPage(root, type); // Kalla á Flashcards með flokk (type)
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
