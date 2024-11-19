import { fetcher } from "./lib/fetcher.js";
import { renderNavigation } from "./lib/navigation.js";
import { createElement } from "./lib/elements.js";

async function render(root, querystring) {
  const params = new URLSearchParams(querystring);
  const type = params.get("type"); // e.g., "css", "html", "js"
  const content = params.get("content"); // e.g., "keywords", "lectures", "questions"

  root.innerHTML = ""; // Clear previous content

  if (!type) {
    return renderHomePage(root);
  }

  const folderData = await fetcher(`data/${type}/index.json`);
  if (!folderData) {
    root.innerHTML = `<p>Gat ekki sótt gögn fyrir ${type}.</p>`;
    return;
  }

  if (!content) {
    renderContentOptions(root, folderData, type);
  } else if (content === "keywords") {
    renderKeywords(root, type);
  } else if (content === "lectures") {
    renderLectures(root, type);
  } else if (content === "questions") {
    renderQuestions(root, type);
  }
}

function renderHomePage(root) {
  const mainElement = createElement(
    "main",
    {},
    createElement("p", {}, "Veldu efni sem þú vilt læra um:"),
    createElement(
      "ul",
      {},
      createElement(
        "li",
        {},
        createElement("a", { href: "/?type=css" }, "CSS")
      ),
      createElement(
        "li",
        {},
        createElement("a", { href: "/?type=html" }, "HTML")
      ),
      createElement(
        "li",
        {},
        createElement("a", { href: "/?type=js" }, "JavaScript")
      )
    )
  );
  root.appendChild(mainElement);
}

function renderContentOptions(root, folderData, type) {
  const options = ["keywords", "lectures", "questions"];
  const mainElement = createElement(
    "main",
    {},
    createElement("h2", {}, `Valmynd fyrir ${folderData.title}`),
    createElement(
      "ul",
      {},
      ...options.map((option) =>
        createElement(
          "li",
          {},
          createElement(
            "a",
            { href: `/?type=${type}&content=${option}` },
            option
          )
        )
      )
    )
  );
  root.appendChild(mainElement);
}

async function renderKeywords(root, type) {
  const data = await fetcher(`data/${type}/keywords.json`);
  const mainElement = createElement(
    "main",
    {},
    createElement("h2", {}, "Lykilhugtök"),
    createElement(
      "ul",
      {},
      ...data.keywords.map((keyword) =>
        createElement("li", {}, `${keyword.title}: ${keyword.content}`)
      )
    )
  );
  root.appendChild(mainElement);
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

async function renderQuestions(root, type) {
  const data = await fetcher(`data/${type}/questions.json`);
  let currentIndex = 0;

  function renderQuestion() {
    const question = data.questions[currentIndex];
    if (!question) {
      root.innerHTML = "<p>Engar fleiri spurningar.</p>";
      return;
    }

    root.innerHTML = ""; // Clear

    const questionElement = createElement(
      "div",
      {},
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
      ),
      createElement("button", { id: "next-btn" }, "Næsta")
    );

    root.appendChild(questionElement);
    document.getElementById("next-btn").addEventListener("click", () => {
      currentIndex++;
      renderQuestion();
    });
  }

  renderQuestion();
}

window.addEventListener("popstate", () => {
  render(document.querySelector("#app"), window.location.search);
});

document.addEventListener("DOMContentLoaded", () => {
  render(document.querySelector("#app"), window.location.search);
});
