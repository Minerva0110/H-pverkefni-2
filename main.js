document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#buttons-container button");
  const flashcardsContainer = document.getElementById("flashcards-container");
  let correctAnswers = 0;
  let totalQuestions = 0;

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const topic = button.dataset.topic; // Get topic (e.g., 'css', 'html', 'js', 'flashcards')
      if (topic === 'flashcards') {
        loadAllFlashcards();
      } else {
        addNavigationButtons(topic);
      }
    });
  });

  function addNavigationButtons(topic) {
    const existingNav = document.querySelector(".navigation-buttons");
    if (existingNav) {
      existingNav.remove();
    }

    const navigationContainer = document.createElement("div");
    navigationContainer.className = "navigation-buttons";
    navigationContainer.innerHTML = `
        <button id="show-lectures">Fyrirlestrar</button>
        <button id="show-keywords">Lykilhugtök</button>
        <button id="show-questions">Spurningar</button>
      `;
    flashcardsContainer.innerHTML = "";
    flashcardsContainer.appendChild(navigationContainer);

    document.getElementById("show-lectures").addEventListener("click", () => {
      loadLectures(topic);
    });

    document.getElementById("show-keywords").addEventListener("click", () => {
      loadKeywords(topic);
    });

    document.getElementById("show-questions").addEventListener("click", () => {
      loadQuestions(topic);
    });
  }

  function loadAllFlashcards() {
    const flashcardData = [
      { question: "Hvað þýðir CSS?", answer: "Cascading Style Sheets" },
      { question: "Hvað stendur HTML fyrir?", answer: "HyperText Markup Language" },
      { question: "Hvað gerir 'let' í JavaScript?", answer: "Skilgreinir breytu sem er block-scoped." },
      { question: "Hvernig breytir þú bakgrunnslit?", answer: "background-color: color;" },
      { question: "Hvernig köllum við á fall?", answer: "fallanfn();" },
      { question: "Hver er grunnþáttur HTML skjals?", answer: "<html>" }
    ];

    flashcardsContainer.innerHTML = "";
    flashcardData.forEach((card) => {
      flashcardsContainer.appendChild(createFlipFlashcard(card));
    });
  }

  function createFlipFlashcard(data) {
    const flashcard = document.createElement("div");
    flashcard.className = "flashcard flip-card";
    flashcard.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">${data.question}</div>
        <div class="flip-card-back">${data.answer}</div>
      </div>
    `;
    flashcard.addEventListener("click", () => {
      flashcard.classList.toggle("flipped");
    });
    return flashcard;
  }

  async function loadLectures(topic) {
    try {
      const response = await fetch(`data/${topic}/lectures.json`);
      if (!response.ok) {
        throw new Error(
          `Error fetching data for ${topic}: ${response.statusText}`
        );
      }
      const data = await response.json();

      // Clear previous content
      flashcardsContainer.innerHTML = "";

      // Render lectures data as text
      data.lectures.forEach((lecture) => {
        const lectureContainer = document.createElement("div");
        lectureContainer.className = "lecture-container";
        lectureContainer.innerHTML = `<h3>${lecture.title}</h3>`;

        lecture.content.forEach((contentItem) => {
          if (contentItem.type === "heading") {
            lectureContainer.innerHTML += `<h4>${contentItem.data}</h4>`;
          } else if (contentItem.type === "text") {
            lectureContainer.innerHTML += `<p>${contentItem.data}</p>`;
          } else if (contentItem.type === "quote") {
            lectureContainer.innerHTML += `<blockquote>${contentItem.data}<br><small>${contentItem.attribute || ""}</small></blockquote>`;
          } else if (contentItem.type === "image") {
            lectureContainer.innerHTML += `<div class="image-container"><img src="${contentItem.data}" alt="${contentItem.caption || ""}" class="full-width-image"><p>${contentItem.caption || ""}</p></div>`;
          } else if (contentItem.type === "list") {
            lectureContainer.innerHTML += `<ul>${contentItem.data.map(item => `<li>${item}</li>`).join("")}</ul>`;
          }
        });

        flashcardsContainer.appendChild(lectureContainer);
      });

      saveProgress(topic, "lectures", true);
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML =
        "<p>Error loading the lectures. Please try again later.</p>";
    }
  }

  async function loadKeywords(topic) {
    try {
      const response = await fetch(`data/${topic}/keywords.json`);
      if (!response.ok) {
        throw new Error(
          `Error fetching keywords for ${topic}: ${response.statusText}`
        );
      }
      const data = await response.json();
      flashcardsContainer.innerHTML = "";

      data.keywords.forEach((keyword, index) => {
        const card = createKeywordCard(keyword, index, data.keywords.length);
        flashcardsContainer.appendChild(card);
      });
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML =
        "<p>Error loading the keywords. Please try again later.</p>";
    }
  }

  function createKeywordCard(keyword, index, totalKeywords) {
    const card = document.createElement("div");
    card.className = "flashcard card";
    card.innerHTML = `
      <div class="card-content">
        <h3>${keyword.title}</h3>
        <p>${keyword.content}</p>
      </div>
      <div class="card-footer">
        ${index > 0 ? `<button class="prev-card-btn">Til baka</button>` : ""}
        ${index < totalKeywords - 1 ? `<button class="next-card-btn">Næsta</button>` : ""}
      </div>
    `;

    if (index > 0) {
      card.querySelector(".prev-card-btn").addEventListener("click", () => {
        showKeyword(index - 1);
      });
    }

    if (index < totalKeywords - 1) {
      card.querySelector(".next-card-btn").addEventListener("click", () => {
        showKeyword(index + 1);
      });
    }

    return card;
  }

  function showKeyword(index) {
    const keywords = document.querySelectorAll(".flashcard.card");
    keywords.forEach((keyword, i) => {
      keyword.style.display = i === index ? "block" : "none";
    });
  }

  async function loadQuestions(topic) {
    try {
      const response = await fetch(`data/${topic}/questions.json`);
      if (!response.ok) {
        throw new Error(
          `Error fetching questions for ${topic}: ${response.statusText}`
        );
      }
      const data = await response.json();

      flashcardsContainer.innerHTML = "";
      correctAnswers = 0;
      totalQuestions = data.questions.length;
      data.questions = shuffleArray(data.questions);

      data.questions.forEach((question, index) => {
        question.answers = shuffleArray(question.answers);
        const card = createQuestionCard(question, index);
        flashcardsContainer.appendChild(card);
      });

      // Show the first card
      const firstCard = flashcardsContainer.querySelector(".flashcard");
      if (firstCard) {
        firstCard.style.display = "block";
      }

      // Save progress to localStorage
      saveProgress(topic, "questions", true);
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML =
        "<p>Error loading the questions. Please try again later.</p>";
    }
  }

  function createQuestionCard(question, index) {
    const card = document.createElement("div");
    card.className = "flashcard card";
    card.innerHTML = `
        <div class="card-content">
          <h3>Spurning ${index + 1}</h3>
          <p>${question.question}</p>
          <div class="answer-buttons">
            ${question.answers.map((answer, i) => `<button class="answer-button" data-answer-index="${i}">${answer.answer}</button>`).join("")}
          </div>
        </div>
        <div class="card-footer">
          <button class="next-card-btn" style="display:none;">Næsta</button>
        </div>
      `;
  
    const answerButtons = card.querySelectorAll(".answer-button");
    answerButtons.forEach((button, i) => {
      button.addEventListener("click", () => {
        const correctAnswer = question.answers.find(ans => ans.correct).answer;
        const isCorrect = question.answers[i].correct;
        saveProgress(`${index + 1}`, isCorrect, question.question, question.answers[i].answer, correctAnswer);
        answerButtons.forEach((btn) => (btn.disabled = true));
        card.querySelector(".next-card-btn").style.display = "inline-block";
        if (isCorrect) {
          triggerConfetti();
        }
      });
    });
  
    card.querySelector(".next-card-btn").addEventListener("click", () => {
      card.style.display = "none";
      const nextCard = card.nextElementSibling;
      if (nextCard) {
        nextCard.style.display = "block";
      } else {
        showResults();
      }
    });
  
    card.style.display = "none";
    return card;
  }

  function showResults() {
    let progress = JSON.parse(localStorage.getItem('userProgress')) || {};
    let correctCount = 0;
    let incorrectCount = 0;
  
    Object.keys(progress).forEach(key => {
      const { isCorrect } = progress[key];
      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });
  
    const percentage = ((correctCount / (correctCount + incorrectCount)) * 100).toFixed(2);
    flashcardsContainer.innerHTML = `<div>Þú fékkst ${percentage}% rétt.</div><div><p>Viltu skoða framfarir þínar?</p><button id="view-progress-btn">Skoða framfarir</button><button id="back-btn">Til baka</button></div>`;
  
    if (percentage === "100.00") {
      triggerConfetti();
    }
  
    document.getElementById("view-progress-btn").addEventListener("click", () => {
      window.location.href = "progress.html";
    });
    document.getElementById("back-btn").addEventListener("click", () => {
      flashcardsContainer.innerHTML = "";
      document
        .getElementById("buttons-container")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  // Function to trigger confetti effect
  function triggerConfetti() {
    // Using canvas-confetti library for confetti effect
    if (typeof confetti === "function") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      console.log("Confetti!");
    }
  }

  // Function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function saveProgress(questionId, isCorrect, question, userAnswer, correctAnswer) {
    let progress = JSON.parse(localStorage.getItem('userProgress')) || {};
    progress[questionId] = {
      isCorrect,
      question,
      userAnswer,
      correctAnswer
    };
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }

  // Add Flashcards as a topic to learn from
  const flashcardsButton = document.createElement("button");
  flashcardsButton.textContent = "Flashcards";
  flashcardsButton.dataset.topic = "flashcards";
  document.getElementById("buttons-container").appendChild(flashcardsButton);
});
