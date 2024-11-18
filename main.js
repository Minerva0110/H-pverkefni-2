import { fetcher } from './lib/fetcher.js';
import { renderContentPage } from './lib/pages/content-page.js';
import { renderIndexPage } from './lib/pages/index-page.js';
import { renderSubpage } from './lib/pages/sub-page.js';

async function render(root, querystring) {
    console.log('Rendering started');
    
    const mainIndexJson = await fetcher('data/index.json');
    if (!mainIndexJson) {
        console.error('Failed to load mainIndexJson');
        return;
    }

    console.log('Fetched index.json:', mainIndexJson);
    
    const params = new URLSearchParams(querystring);
    const type = params.get('type'); 
    const content = params.get('content'); 

  
    root.innerHTML = '';

    const headerElement = document.createElement('header');
    headerElement.innerHTML = `<h1>${mainIndexJson.title}</h1>`;
    
    const footerElement = document.createElement('footer');
    footerElement.textContent = mainIndexJson.footer;

    root.appendChild(headerElement);

    console.log('Type:', type, 'Content:', content);


    if (!type) {
        console.log('Rendering Index Page');
        renderIndexPage(root, mainIndexJson);
    } else if (content) {
        console.log('Rendering Content Page');
        renderContentPage(root, mainIndexJson, type, content);
    } else {
        console.log('Rendering Subpage');
        renderSubpage(root, mainIndexJson, type);
    }


    root.appendChild(footerElement);
}

window.addEventListener('popstate', () => {
    render(document.querySelector('#app'), window.location.search);
});

document.addEventListener('DOMContentLoaded', () => {
    render(document.querySelector('#app'), window.location.search);
});
