import { fetcher } from '../fetcher.js';

export async function renderFlashcardsPage(root, type) {
    const keywordsJson = await fetcher(`data/${type}/keywords.json`);
    if (!keywordsJson || !keywordsJson.keywords) {
        root.innerHTML = '<p>Engin flashcards fundust fyrir þetta efni.</p>';
        return;
    }

    let currentIndex = 0;
    const keywords = keywordsJson.keywords;

    const flashcardContainer = document.createElement('div');
    flashcardContainer.id = 'flashcard';

    const titleElement = document.createElement('h2');
    titleElement.id = 'term';
    const definitionElement = document.createElement('p');
    definitionElement.id = 'definition';
    definitionElement.style.display = 'none';

    const revealButton = document.createElement('button');
    revealButton.id = 'reveal-btn';
    revealButton.textContent = 'Sýna skilgreiningu';

    const nextButton = document.createElement('button');
    nextButton.id = 'next-btn';
    nextButton.textContent = 'Næsta';

    flashcardContainer.appendChild(titleElement);
    flashcardContainer.appendChild(definitionElement);
    flashcardContainer.appendChild(revealButton);
    flashcardContainer.appendChild(nextButton);

    root.appendChild(flashcardContainer);

    function showFlashcard(index) {
        const term = keywords[index];
        titleElement.textContent = term.title;
        definitionElement.textContent = term.content;
        definitionElement.style.display = 'none';
    }

    revealButton.addEventListener('click', () => {
        definitionElement.style.display = 'block';
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % keywords.length;
        showFlashcard(currentIndex);
    });

    showFlashcard(currentIndex);
}
