document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("progress.html")) {
      const progressContainer = document.getElementById("progress-container");
      let progress = JSON.parse(localStorage.getItem('userProgress')) || {};
  
      if (Object.keys(progress).length === 0) {
        progressContainer.innerHTML = "<p>Engar framfarir fundust. Reyndu að klára quiz til að sjá framfarir.</p>";
        return;
      }
  
      let cssCorrect = 0;
      let htmlCorrect = 0;
      let jsCorrect = 0;
      let progressGrid = document.createElement("div");
      progressGrid.className = "progress-grid";
  
      // Loop over the progress and create rows for each question
      Object.keys(progress).forEach((key) => {
        const { isCorrect, question, userAnswer, correctAnswer } = progress[key];
        const row = document.createElement("div");
        row.className = "progress-row";
        row.innerHTML = `
          <div class="question"><strong>Spurning:</strong> ${question}</div>
          <div class="user-answer"><strong>Þitt svar:</strong> ${userAnswer}</div>
          <div class="correct-answer"><strong>Rétt svar:</strong> ${correctAnswer}</div>
          <div class="status">${isCorrect ? '✔️ Rétt' : '❌ Rangt'}</div>
        `;
  
        // Track correct answers based on the question content
        if (question.toLowerCase().includes("css")) {
          cssCorrect += isCorrect ? 1 : 0;
        } else if (question.toLowerCase().includes("html")) {
          htmlCorrect += isCorrect ? 1 : 0;
        } else if (question.toLowerCase().includes("js")) {
          jsCorrect += isCorrect ? 1 : 0;
        }
  
        progressGrid.appendChild(row);
      });
  
      // Append the grid containing all questions and answers
      progressContainer.appendChild(progressGrid);
  
      // Append summary statistics
      progressContainer.innerHTML += `
        <div class="summary">
          <div>Rétt svör í CSS: ${cssCorrect}</div>
          <div>Rétt svör í HTML: ${htmlCorrect}</div>
          <div>Rétt svör í JavaScript: ${jsCorrect}</div>
        </div>
      `;
    }
  });
  