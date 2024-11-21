document.addEventListener("DOMContentLoaded", () => {
  const progressContainer = document.getElementById("progress-container");
  let progress = JSON.parse(localStorage.getItem("userProgress")) || [];

  if (progress.length === 0) {
    progressContainer.innerHTML = "<p>Engar framfarir til að sýna.</p>";
    return;
  }

  progress.forEach((item, index) => {
    const progressItem = document.createElement("div");
    progressItem.className = "progress-item";
    progressItem.innerHTML = `
        <p><strong>Dagsetning:</strong> ${item.date}</p>
        <p><strong>Spurning ${index + 1}:</strong> ${item.question}</p>
        <p><strong>Svarað:</strong> ${item.userAnswer}</p>
        <p><strong>Rétt svar:</strong> ${item.correctAnswer}</p>
        <p><strong>Rétt/Rangt:</strong> ${item.isCorrect ? "Rétt" : "Rangt"}</p>
        <hr>
      `;
    progressContainer.appendChild(progressItem);
  });

  document
    .getElementById("clear-progress-btn")
    .addEventListener("click", () => {
      if (confirm("Ertu viss um að þú viljir hreinsa allar framfarir?")) {
        localStorage.removeItem("userProgress");
        progressContainer.innerHTML = "<p>Engar framfarir til að sýna.</p>";
      }
    });
});
