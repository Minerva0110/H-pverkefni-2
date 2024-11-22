document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#buttons-container button");
  const flashcardsContainer = document.getElementById("flashcards-container");
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let topic = "";
  let totalQuestions = 0;

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      // Reset all button colors
      buttons.forEach((btn) => {
        btn.style.backgroundColor = ""; // Reset to default
      });

      button.style.backgroundColor = "#5A7184";

      topic = button.dataset.topic; // Get topic (e.g., 'css', 'html', 'js')
      addNavigationButtons(topic);
    });
  });

  // Function to add navigation buttons
  function addNavigationButtons(topic) {
    // Clear previous navigation buttons if any
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
    flashcardsContainer.innerHTML = ""; // Clear previous content
    flashcardsContainer.appendChild(navigationContainer);

    // Add event listeners to the newly created buttons
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

  // Function to load lectures
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
            lectureContainer.innerHTML += `<blockquote>${
              contentItem.data
            }<br><small>${contentItem.attribute || ""}</small></blockquote>`;
          } else if (contentItem.type === "image") {
            lectureContainer.innerHTML += `<div class="image-container"><img src="${
              contentItem.data
            }" alt="${contentItem.caption || ""}" class="full-width-image"><p>${
              contentItem.caption || ""
            }</p></div>`;
          } else if (contentItem.type === "list") {
            lectureContainer.innerHTML += `<ul>${contentItem.data
              .map((item) => `<li>${item}</li>`)
              .join("")}</ul>`;
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

  // Function to load keywords
  async function loadKeywords(topic) {
    try {
      const response = await fetch(`data/${topic}/keywords.json`);
      if (!response.ok) {
        throw new Error(
          `Error fetching keywords for ${topic}: ${response.statusText}`
        );
      }
      const data = await response.json();

      // Clear previous content
      flashcardsContainer.innerHTML = "";

      data.keywords.forEach((keyword) => {
        const keywordElement = createFlashcard(keyword);
        flashcardsContainer.appendChild(keywordElement);
      });

      // Show the first card
      const firstCard = flashcardsContainer.querySelector(".flashcard");
      if (firstCard) {
        firstCard.style.display = "block";
      }

      // Update progress using just the topic
      saveProgress(topic, true);
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML =
        "<p>Error loading the keywords. Please try again later.</p>";
    }
  }

  // Function to load questions
  async function loadQuestions(topic) {
    try {
      const response = await fetch(`data/${topic}/questions.json`);
      if (!response.ok) {
        throw new Error(
          `Error fetching questions for ${topic}: ${response.statusText}`
        );
      }
      const data = await response.json();

      // Clear previous content
      flashcardsContainer.innerHTML = "";
      correctAnswers = 0;
      incorrectAnswers = 0;
      totalQuestions = data.questions.length;

      // Shuffle questions
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
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML =
        "<p>Error loading the questions. Please try again later.</p>";
    }
  }

  // Function to create a flashcard for keywords
  function createFlashcard(item) {
    const card = document.createElement("div");
    card.className = "flashcard card";
    card.innerHTML = `
        <div class="card-content">
          <h3>${item.title}</h3>
          <p>${
            item.content[0]?.data || item.content || "No content available"
          }</p>
        </div>
        <div class="card-footer">
          <button class="next-card-btn">Næsta</button>
        </div>
      `;
    card.querySelector(".next-card-btn").addEventListener("click", () => {
      card.style.display = "none";
      const nextCard = card.nextElementSibling;
      if (nextCard && nextCard.classList.contains("flashcard")) {
        nextCard.style.display = "block";
      } else {
        flashcardsContainer.innerHTML =
          '<div class="end-message"><p>Engin fleiri kort.</p><button id="back-btn">Til baka</button></div>';
        document.getElementById("back-btn").addEventListener("click", () => {
          flashcardsContainer.innerHTML = "";
          document
            .getElementById("buttons-container")
            .scrollIntoView({ behavior: "smooth" });
        });
      }
    });
    card.style.display = "none";
    return card;
  }

  // Function to create a question card
  function createQuestionCard(question, index) {
    const card = document.createElement("div");
    card.className = "flashcard card";
    card.innerHTML = `
        <div class="card-content">
          <h3>Spurning ${index + 1}</h3>
          <p>${question.question}</p>
          <div class="answer-buttons" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: space-around;">
            ${question.answers
              .map(
                (answer, i) => `
                  <button class="answer-button" data-answer-index="${i}" style="margin: 5px;">
                    ${answer.answer}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="card-footer">
          <button class="next-card-btn" style="display:none;">Næsta</button>
        </div>
      `;

    const answerButtons = card.querySelectorAll(".answer-button");
    answerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const answerIndex = parseInt(button.dataset.answerIndex, 10);
        const isCorrect = question.answers[answerIndex].correct;

        // Change button colors and reset others
        answerButtons.forEach((btn) => {
          if (btn === button) {
            btn.style.backgroundColor = "#5A7184"; // Selected color
          } else {
            btn.style.backgroundColor = ""; // Reset color
          }
        });

        saveProgress(`question-${index + 1}`, isCorrect, topic);
        if (isCorrect) {
          correctAnswers++;
          triggerConfetti();
        } else {
          incorrectAnswers++;
        }
        card.querySelector(".next-card-btn").style.display = "inline-block";
      });
    });

    card.querySelector(".next-card-btn").addEventListener("click", () => {
      card.style.display = "none";
      const nextCard = card.nextElementSibling;
      if (nextCard && nextCard.classList.contains("flashcard")) {
        nextCard.style.display = "block";
      } else {
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        flashcardsContainer.innerHTML = `
          <div class="end-message">
            <p>Þú fékkst ${score}% rétt.</p>
            <p>Viltu sjá framfarir þínar?</p>
            <button id="progress-btn">Framfarir</button>
            <button id="back-btn">Til baka</button>
          </div>`;

        document
          .getElementById("progress-btn")
          .addEventListener("click", () => {
            window.location.href = "progress.html";
          });

        document.getElementById("back-btn").addEventListener("click", () => {
          flashcardsContainer.innerHTML = "";
          document
            .getElementById("buttons-container")
            .scrollIntoView({ behavior: "smooth" });
        });
      }
    });

    card.style.display = "none";
    return card;
  }

  // Geymir framvindu notandans í localStorage
  function saveProgress(questionId, isCorrect, topic) {
    const date = new Date().toLocaleDateString("is-IS");
    const progressKey = `${date}-${topic}`;
    let progress = JSON.parse(localStorage.getItem("userProgress")) || {};

    if (!progress[progressKey]) {
      progress[progressKey] = { correct: 0, incorrect: 0 };
    }

    if (isCorrect) {
      progress[progressKey].correct++;
    } else {
      progress[progressKey].incorrect++;
    }

    localStorage.setItem("userProgress", JSON.stringify(progress));
  }

  // Function to display progress in progress.html
  function displayProgress() {
    let progress = JSON.parse(localStorage.getItem("userProgress")) || {};
    const progressList = document.getElementById("progress-list");
    if (!progressList) {
      console.error("Framvindulistinn fannst ekki!");
      return;
    }

    progressList.innerHTML = ""; // Clear existing progress

    // Iterate over each progress entry and filter valid ones
    Object.keys(progress).forEach((progressKey) => {
      const [date, topic] = progressKey.split("-");
      const { correct, incorrect } = progress[progressKey];
      if (
        typeof correct !== "undefined" &&
        typeof incorrect !== "undefined" &&
        topic &&
        !isNaN(correct) &&
        !isNaN(incorrect)
      ) {
        const total = correct + incorrect;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

        const listItem = document.createElement("li");
        listItem.textContent = `${date} (${topic}): Rétt svör: ${correct}, Röng svör: ${incorrect}, Prósenta: ${percentage}%`;
        progressList.appendChild(listItem);
      }
    });
  }

  // Check if the page is progress.html to display progress
  if (window.location.pathname.includes("progress.html")) {
    window.onload = displayProgress;
  }

  // Function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // Function to load lectures
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
            lectureContainer.innerHTML += `<blockquote>${
              contentItem.data
            }<br><small>${contentItem.attribute || ""}</small></blockquote>`;
          } else if (contentItem.type === "image") {
            lectureContainer.innerHTML += `<div class="image-container"><img src="${
              contentItem.data
            }" alt="${contentItem.caption || ""}" class="full-width-image"><p>${
              contentItem.caption || ""
            }</p></div>`;
          } else if (contentItem.type === "list") {
            lectureContainer.innerHTML += `<ul>${contentItem.data
              .map((item) => `<li>${item}</li>`)
              .join("")}</ul>`;
          }
        });

        flashcardsContainer.appendChild(lectureContainer);
      });

      // Add buttons at the bottom
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "lecture-footer-buttons";
      buttonsContainer.innerHTML = `
        <button id="home-btn">Heim</button>
        <button id="questions-btn">Tilbúin/n í Spurningar</button>
    `;

      flashcardsContainer.appendChild(buttonsContainer);

      // Add event listeners to the new buttons
      document.getElementById("home-btn").addEventListener("click", () => {
        location.reload();
      });

      document.getElementById("questions-btn").addEventListener("click", () => {
        loadQuestions(topic);
      });
    } catch (error) {
      console.error(error);
      flashcardsContainer.innerHTML =
        "<p>Error loading the lectures. Please try again later.</p>";
    }
  }

  // Function to trigger confetti
  function triggerConfetti() {
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
});
