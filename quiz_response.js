// Função para carregar o quiz ativo do localStorage
function loadActiveQuiz() {
    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const activeQuiz = quizzes.find(quiz => quiz.isActive);

    if (!activeQuiz) {
        alert("Nenhum quiz ativo encontrado!");
        return;
    }

    displayCurrentQuestion(activeQuiz);
}

// Array para armazenar as respostas do usuário
let userResponses = [];

// Função para mostrar uma pergunta com base no índice atual
function displayCurrentQuestion(quiz) {
    const quizForm = document.getElementById('quiz-response-form');
    quizForm.innerHTML = '';

    const question = quiz.questions[currentQuestionIndex];
    const questionElement = document.createElement('div');

    let questionHtml = `<label>${question.questionText}</label><br>`;
    question.options.forEach((option, optionIndex) => {
        questionHtml += `<input type="radio" name="question" value="${option}" 
        ${userResponses[currentQuestionIndex] === option ? "checked" : ""}> ${option}<br>`;
    });

    questionElement.innerHTML = questionHtml;
    quizForm.appendChild(questionElement);

    // Atualizar a visibilidade dos botões
    document.getElementById('prev-question-btn').style.visibility = (currentQuestionIndex === 0) ? 'hidden' : 'visible';
    document.getElementById('next-question-btn').style.visibility = (currentQuestionIndex === quiz.questions.length - 1) ? 'hidden' : 'visible';
    document.getElementById('submit-quiz-btn').style.visibility = (currentQuestionIndex === quiz.questions.length - 1) ? 'visible' : 'hidden';
}

// Variável para controlar qual pergunta está sendo mostrada
let currentQuestionIndex = 0;

// Função para mostrar a próxima pergunta
function showNextQuestion() {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    userResponses[currentQuestionIndex] = selectedOption ? selectedOption.value : null;

    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const activeQuiz = quizzes.find(quiz => quiz.isActive);
    
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion(activeQuiz);
    }
}

// Função para mostrar a pergunta anterior
function showPrevQuestion() {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    userResponses[currentQuestionIndex] = selectedOption ? selectedOption.value : null;

    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const activeQuiz = quizzes.find(quiz => quiz.isActive);
    
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion(activeQuiz);
    }
}

// Função para coletar e avaliar as respostas do usuário
function submitResponses() {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    userResponses[currentQuestionIndex] = selectedOption ? selectedOption.value : null;

    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const activeQuiz = quizzes.find(quiz => quiz.isActive);

    const score = calculateScore(activeQuiz);

    // Mostrar a pontuação ao usuário na modal
    document.getElementById('score-display').innerText = `Você acertou ${score} de ${activeQuiz.questions.length} perguntas!`;
    $('#scoreModal').modal('show'); // Usando Bootstrap para mostrar a modal

    // Desabilitar o botão "Pergunta Anterior"
    document.getElementById('prev-question-btn').disabled = true;
}

// Função para calcular a pontuação do usuário com base em suas respostas
function calculateScore(quiz) {
    let score = 0;

    quiz.questions.forEach((question, index) => {
        if (userResponses[index] === question.correctAnswer) {
            score++;
        }
    });

    return score;
}

// Chamar a função para carregar o quiz ativo quando a página é carregada
window.onload = loadActiveQuiz;
