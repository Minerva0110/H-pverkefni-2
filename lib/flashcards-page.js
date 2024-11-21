document.addEventListener("DOMContentLoaded", () => {
  const flashcardsContainer = document.getElementById("flashcards-container");
  const buttonsContainer = document.getElementById("buttons-container");
 
 
  const flashcardData = {
    css: [
      { question: "Hvað þýðir CSS?", answer: "Cascading Style Sheets" },
      {
        question: "Hvernig breytir þú bakgrunnslit?",
        answer: "background-color: color;",
      },
    ],
    html: [
      {
        question: "Hvað stendur HTML fyrir?",
        answer: "HyperText Markup Language",
      },
      { question: "Hver er grunnþáttur HTML skjals?", answer: "<html>" },
    ],
    js: [
      {
        question: "Hvað gerir 'let' í JavaScript?",
        answer: "Skilgreinir breytu sem er block-scoped.",
      },
      { question: "Hvernig köllum við á fall?", answer: "fallanfn();" },
    ],
  };
 
 
  const createFlashcard = (data) => {
    const flashcard = document.createElement("div");
    flashcard.className = "flashcard";
    flashcard.innerHTML = `
            <div class="front">${data.question}</div>
            <div class="back">${data.answer}</div>
        `;
    flashcard.addEventListener("click", () => {
      flashcard.classList.toggle("flipped");
    });
    return flashcard;
  };
 
 
  const loadFlashcards = (topic) => {
    flashcardsContainer.innerHTML = "";
    flashcardData[topic].forEach((card) => {
      flashcardsContainer.appendChild(createFlashcard(card));
    });
  };
 
 
  buttonsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      loadFlashcards(e.target.dataset.topic);
    }
  });
 
 
  // Hlaða CSS flashcards þegar síðan opnast
  loadFlashcards("css");
 });
 