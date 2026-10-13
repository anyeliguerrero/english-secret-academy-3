
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const pages = document.querySelectorAll(".page");
  const navigation = document.getElementById("navigation");
  const menuToggle = document.getElementById("menuToggle");

  // Cambiar entre pestañas
  function showPage(pageId) {
    const target = document.getElementById(pageId);

    if (!target || !target.classList.contains("page")) {
      return;
    }

    pages.forEach((page) => {
      page.classList.toggle("active", page.id === pageId);
    });

    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === pageId;

      tab.classList.toggle("active", isActive);

      if (isActive) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });

    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showPage(tab.dataset.tab);
    });
  });

  // Botones que llevan a otra pestaña
  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showPage(button.dataset.go);
    });
  });

  // Menú para celulares
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Preguntas de práctica
  const questions = [
    {
      question: "Yesterday, I ___ to school.",
      answers: ["go", "went", "gone"],
      correct: 1,
      explanation: "Usamos went porque yesterday indica pasado."
    },
    {
      question: "She has ___ her homework.",
      answers: ["finish", "finished", "finishing"],
      correct: 1,
      explanation: "Present Perfect utiliza have/has + participio pasado."
    },
    {
      question: "They ___ a movie last night.",
      answers: ["watched", "watch", "have watch"],
      correct: 0,
      explanation: "Last night indica una acción terminada en el pasado."
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const feedbackElement = document.getElementById("feedback");
  const counterElement = document.getElementById("questionCounter");
  const scoreElement = document.getElementById("score");
  const nextButton = document.getElementById("nextQuestion");

  function renderQuestion() {
    const item = questions[currentQuestion];

    answered = false;
    questionElement.textContent = item.question;
    counterElement.textContent =
      `${currentQuestion + 1} / ${questions.length}`;

    feedbackElement.textContent = "";
    nextButton.hidden = true;
    answersElement.replaceChildren();

    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");

      button.className = "answer";
      button.textContent = answer;
      button.type = "button";

      button.addEventListener("click", () => {
        checkAnswer(index, button);
      });

      answersElement.appendChild(button);
    });
  }

  function checkAnswer(selectedIndex, selectedButton) {
    if (answered) return;

    answered = true;

    const item = questions[currentQuestion];
    const answerButtons = answersElement.querySelectorAll(".answer");
    const isCorrect = selectedIndex === item.correct;

    answerButtons.forEach((button) => {
      button.disabled = true;
    });

    answerButtons[item.correct].classList.add("correct");

    if (isCorrect) {
      score++;
      feedbackElement.textContent = "¡Correcto! ✨ " + item.explanation;
      feedbackElement.style.color = "#65d6a1";
    } else {
      selectedButton.classList.add("incorrect");
      feedbackElement.textContent = "Inténtalo de nuevo en la próxima. " +
        item.explanation;
      feedbackElement.style.color = "#ffb4be";
    }

    scoreElement.textContent = score;

    nextButton.textContent =
      currentQuestion === questions.length - 1
        ? "Ver resultado"
        : "Siguiente pregunta →";

    nextButton.hidden = false;
  }

  nextButton.addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
      return;
    }

    questionElement.textContent =
      `¡Terminaste! Obtuviste ${score} de ${questions.length} puntos.`;

    answersElement.replaceChildren();

    feedbackElement.textContent =
      score === questions.length
        ? "¡Excelente! Has dominado estas preguntas. 🏆"
        : "¡Buen trabajo! Repasa las lecciones y vuelve a intentarlo.";

    feedbackElement.style.color = "#f1cf87";
    counterElement.textContent = "Completado";
    nextButton.textContent = "Repetir práctica";
    nextButton.hidden = false;

    nextButton.onclick = () => {
      currentQuestion = 0;
      score = 0;
      scoreElement.textContent = "0";
      nextButton.onclick = null;
      renderQuestion();
    };
  });

  renderQuestion();
});
