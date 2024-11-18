import { fetcher } from './lib/fetcher.js';
import { renderContentPage } from './lib/pages/content-page.js';
import { renderIndexPage } from './lib/pages/index-page.js';
import { renderSubpage } from './lib/pages/sub-page.js';

async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

function renderNavigation(navigation, containerId) {
    const navContainer = document.getElementById(containerId);
    navContainer.innerHTML = navigation.map(item => 
        `<a href="/?type=${item.slug}">${item.title}</a>`).join(' | ');
}

function renderContent(data, type, content) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    if (type === 'index') {
        mainContent.innerHTML = `
            <h1>${data.title}</h1>
            <p>${data.description}</p>
        `;
        renderNavigation(data.navigation, 'navigation');
    } else if (content === 'keywords') {
        renderKeywords(data.keywords, 'main-content');
    } else if (content === 'lectures') {
        renderLectures(data.lectures, 'main-content');
    } else if (content === 'questions') {
        renderQuestions(data.questions, 'main-content');
    }
}

function renderKeywords(keywords, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<h2>Lykilhugtök</h2>';
    const flashcardsContainer = document.createElement('div');
    flashcardsContainer.id = 'flashcards-container';
    container.appendChild(flashcardsContainer);

    keywords.forEach(keyword => {
        const card = document.createElement('div');
        card.classList.add('flashcard');
        card.innerHTML = `
            <div class="term">${keyword.title}</div>
            <div class="definition" style="display: none;">${keyword.content}</div>
        `;
        card.addEventListener('click', () => {
            const definition = card.querySelector('.definition');
            definition.style.display = definition.style.display === 'block' ? 'none' : 'block';
        });
        flashcardsContainer.appendChild(card);
    });
}

function renderLectures(lectures, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<h2>Fyrirlestrar</h2>';
    const list = document.createElement('ul');
    lectures.forEach(lecture => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${lecture.title}</strong>: ${lecture.content}`;
        list.appendChild(listItem);
    });
    container.appendChild(list);
}

function renderQuestions(questions, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<h2>Spurningar</h2>';
    const list = document.createElement('ul');
    questions.forEach(question => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <p>${question.question}</p>
            <ul>
                ${question.answers.map(answer => `
                    <li>${answer.answer} ${answer.correct ? '(Rétt)' : ''}</li>
                `).join('')}
            </ul>
        `;
        list.appendChild(listItem);
    });
    container.appendChild(list);
}

async function render(root, querystring) {
  console.log('Rendering started'); // Debugging
  const mainIndexJson = await fetcher('data/index.json');
  
  if (!mainIndexJson) {
      console.error('Failed to load mainIndexJson');
      return;
  }
  
  console.log('Fetched index.json:', mainIndexJson);

  const params = new URLSearchParams(querystring);
  const type = params.get('type');
  const content = params.get('content');

  root.innerHTML = ''; // Clear root before rendering

  const headerElement = document.createElement('header');
  headerElement.innerHTML = `<h1>${mainIndexJson.title}</h1>`;
  const footerElement = document.createElement('footer');
  footerElement.textContent = mainIndexJson.footer;

  root.appendChild(headerElement);
  root.appendChild(footerElement);

  console.log('Type:', type, 'Content:', content);

  if (!type) {
      return renderIndexPage(root, mainIndexJson);
  }

  if (content) {
      return renderContentPage(root, mainIndexJson);
  }

  renderSubpage(root, mainIndexJson, type);
}


window.addEventListener('popstate', handleNavigation);
document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#app');
    render(root, window.location.search);
    handleNavigation();
});
