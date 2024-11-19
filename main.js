document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('#buttons-container button');
  const flashcardsContainer = document.getElementById('flashcards-container');
  
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const topic = button.dataset.topic; // Get topic (e.g., 'css', 'html', 'js')
      await loadTopicData(topic);
    });
  });

  async function loadTopicData(topic) {
    try {
      // Fetch the relevant JSON file for the topic (e.g., css.json, html.json, js.json)
      const response = await fetch(`data/${topic}/lectures.json`);
      if (!response.ok) {
        throw new Error(`Error fetching data for ${topic}: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Clear previous content
      flashcardsContainer.innerHTML = '';

      // Render the data into the flashcards container as cards
      data.lectures.forEach(lecture => {
        const card = createFlashcard(lecture);
        flashcardsContainer.appendChild(card);
      });

      // Add navigation buttons for selecting other options
      const navigationContainer = document.createElement('div');
      navigationContainer.className = 'navigation-buttons';
      navigationContainer.style.gap = '5px';
      navigationContainer.innerHTML = `
        <button id="show-lectures">Fyrirlestrar</button>
        <button id="show-keywords">Lykilhugtök</button>
        <button id="show-questions">Spurningar</button>
      `;
      navigationContainer.style.gap = '2px';
      flashcardsContainer.appendChild(navigationContainer);

      document.getElementById('show-lectures').addEventListener('click', () => {
        loadTopicData(topic);
      });
      document.getElementById('show-keywords').addEventListener('click', () => {
        loadKeywords(topic);
      });

      document.getElementById('show-questions').addEventListener('click', () => {
        loadQuestions(topic);
      });
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML = '<p>Error loading the data. Please try again later.</p>';
    }
  }

  function createFlashcard(lecture) {
    // Create a card for each lecture
    const card = document.createElement('div');
    card.className = 'flashcard card';
    card.innerHTML = `
      <div class="card-content">
        <h3>${lecture.title}</h3>
        <p>${lecture.content[0]?.data || 'No content available'}</p>
      </div>
      <div class="card-footer">
        <button class="next-card-btn">Næsta</button>
      </div>
    `;

    card.querySelector('.next-card-btn').addEventListener('click', () => {
      card.style.display = 'none';
      const nextCard = card.nextElementSibling;
      if (nextCard && nextCard.classList.contains('flashcard')) {
        nextCard.style.display = 'block';
      } else {
        flashcardsContainer.innerHTML = '<div class="end-message"><p>Engin fleiri kort.</p><button id="back-btn">Til baka</button></div>';
        const endMessage = document.querySelector('.end-message');
        endMessage.style.display = 'flex';
        endMessage.style.flexDirection = 'column';
        endMessage.style.alignItems = 'center';
        endMessage.style.justifyContent = 'center';
        endMessage.style.height = '200px';
      }
    });

    card.style.display = 'none'; 
    return card;
  }

  async function loadKeywords(topic) {
    try {
      const response = await fetch(`data/${topic}/keywords.json`);
      if (!response.ok) {
        throw new Error(`Error fetching keywords for ${topic}: ${response.statusText}`);
      }
      const data = await response.json();

      flashcardsContainer.innerHTML = '';

      data.keywords.forEach(keyword => {
        const keywordElement = document.createElement('div');
        keywordElement.className = 'flashcard card';
        keywordElement.innerHTML = `
          <div class="card-content">
            <h3>${keyword.title}</h3>
            <p>${keyword.content}</p>
          </div>
          <div class="card-footer">
            <button class="next-card-btn">Næsta</button>
          </div>
        `;

        keywordElement.querySelector('.next-card-btn').addEventListener('click', () => {
          keywordElement.style.display = 'none';
          const nextCard = keywordElement.nextElementSibling;
          if (nextCard && nextCard.classList.contains('flashcard')) {
            nextCard.style.display = 'block';
          } else {
            flashcardsContainer.innerHTML = '<div class="end-message"><p>Engin fleiri kort.</p></div>';
        const endMessage = document.querySelector('.end-message');
        endMessage.style.display = 'flex';
        endMessage.style.flexDirection = 'column';
        endMessage.style.alignItems = 'center';
        endMessage.style.justifyContent = 'center';
        endMessage.style.height = '200px';
        document.getElementById('back-btn').addEventListener('click', () => {
          flashcardsContainer.innerHTML = '';
          document.getElementById('buttons-container').scrollIntoView({ behavior: 'smooth' });
        });
          }
        });

        keywordElement.style.display = 'none';
        flashcardsContainer.appendChild(keywordElement);
      });

      const firstCard = flashcardsContainer.querySelector('.flashcard');
      if (firstCard) {
        firstCard.style.display = 'block';
      }
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML = '<p>Error loading the keywords. Please try again later.</p>';
    }
  }

  async function loadQuestions(topic) {
    try {
      const response = await fetch(`data/${topic}/questions.json`);
      if (!response.ok) {
        throw new Error(`Error fetching questions for ${topic}: ${response.statusText}`);
      }
      const data = await response.json();
      renderQuestions(flashcardsContainer, data);
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML = '<p>Error loading the questions. Please try again later.</p>';
    }
  }

  window.addEventListener("popstate", () => {
    render(document.querySelector("#app"), window.location.search);
  });

  document.addEventListener("DOMContentLoaded", () => {
    render(document.querySelector("#app"), window.location.search);
  });

  async function render(root, type) {
    if (!type) {
      root.innerHTML = "<p>Veldu efni til að byrja að læra.</p>";
      return;
    }

    if (type.includes("lectures")) {
      await renderLectures(root, type);
    } else if (type.includes("questions")) {
      await renderQuestions(root, type);
    }
  }

  async function renderLectures(root, type) {
    const data = await fetcher(`data/${type}/lectures.json`);
    const mainElement = createElement(
      "main",
      {},
      createElement("h2", {}, "Fyrirlestrar"),
      ...data.lectures.map((lecture) =>
        createElement(
          "section",
          {},
          createElement("h3", {}, lecture.title),
          ...lecture.content.map((content) => {
            if (content.type === "text") {
              return createElement("p", {}, content.data);
            } else if (content.type === "image") {
              return createElement("img", {
                src: content.data,
                alt: content.caption,
              });
            }
          })
        )
      )
    );
    root.appendChild(mainElement);
  }

  function renderQuestions(root, data) {
    let currentIndex = 0;

    function renderQuestion() {
      const question = data.questions[currentIndex];
      if (!question) {
        root.innerHTML = "<p>Engar fleiri spurningar.</p>";
        return;
      }

      root.innerHTML = "";

      const questionElement = createElement(
        "div",
        { className: 'flashcard card' },
        createElement("div", { className: 'card-content' },
          createElement("h2", {}, `Spurning ${currentIndex + 1}`),
          createElement("p", {}, question.question),
          createElement(
            "ul",
            {},
            ...question.answers.map((answer) =>
              createElement(
                "li",
                {},
                `${answer.answer} (${answer.correct ? "Rétt" : "Rangt"})`
              )
            )
          )
        ),
        createElement("div", { className: 'card-footer' },
          createElement("button", { id: "next-btn" }, "Næsta")
        )
      );

      root.appendChild(questionElement);
      document.getElementById("next-btn").addEventListener("click", () => {
        currentIndex++;
        renderQuestion();
      });
    }

    renderQuestion();
  }
});
