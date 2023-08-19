
document.addEventListener('DOMContentLoaded', (event) => {
    // O código original estará aqui, garantindo que ele seja executado
    // após o carregamento completo do documento
    
// Inicializa os quizzes a partir do LocalStorage ou como um array vazio
const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let activeQuizIndex = null;  // Armazena o índice do quiz ativo

document.getElementById('add-question-btn').addEventListener('click', addQuestion);
document.getElementById('quiz-form').addEventListener('submit', (event) => {
    createQuiz(event);
    updateQuizList();
});
document.getElementById('view-active-quiz-btn').addEventListener('click', viewActiveQuiz);

function addQuestion() {
    const questionContainer = document.getElementById('questions-container');
    
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
        <label>Pergunta: </label>
        <input type="text" class="question" required>
        <label>Opções: </label>
        <input type="text" class="options" required>
        <label>Resposta Correta: </label>
        <input type="text" class="correct-answer" required>
    `;
    
    questionContainer.appendChild(questionElement);
}

function createQuiz(event) {
    event.preventDefault();

    const quizTitle = document.getElementById('quiz-title').value;
    const questionsElements = document.querySelectorAll('#questions-container > div');
    
    const questions = Array.from(questionsElements).map(element => {
        const questionText = element.querySelector('.question').value;
        const options = element.querySelector('.options').value.split(',');
        const correctAnswer = element.querySelector('.correct-answer').value;
        
        return {
            questionText,
            options,
            correctAnswer
        };
    });
    
    const newQuiz = {
        title: quizTitle,
        questions
    };
    
    quizzes.push(newQuiz);
    
    // Atualiza os quizzes no LocalStorage
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    alert('Quiz criado com sucesso!');
    event.target.reset();
}

function updateQuizList() {
    const quizzesContainer = document.getElementById('quizzes-container');
    quizzesContainer.innerHTML = '';  // Limpa a lista atual de quizzes
    
    quizzes.forEach((quiz, index) => {
        const quizElement = document.createElement('li');
        quizElement.className = 'list-group-item';
        quizElement.textContent = quiz.title;
        
        // Botão para tornar o quiz ativo
        const selectButton = document.createElement('button');
        selectButton.textContent = 'Tornar Ativo';
        selectButton.className = 'btn btn-success btn-sm ml-2';
        selectButton.addEventListener('click', () => selectQuiz(index));
        
        // Botão para editar o quiz

        // Botão para visualizar o quiz
        // const viewButton = document.createElement('button');
        // viewButton.textContent = 'Visualizar';
        // viewButton.className = 'btn btn-info btn-sm ml-2';
        // viewButton.addEventListener('click', () => viewQuiz(index));
        
        // quizElement.appendChild(viewButton);
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'btn btn-primary btn-sm ml-2';
        editButton.addEventListener('click', () => editQuiz(index));
        
        // Botão para excluir o quiz
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.className = 'btn btn-danger btn-sm ml-2';
        deleteButton.addEventListener('click', () => deleteQuiz(index));
        
        quizElement.appendChild(selectButton);
        quizElement.appendChild(editButton);
        quizElement.appendChild(deleteButton);
        quizzesContainer.appendChild(quizElement);
    });
}

function selectQuiz(index) {
    activeQuizIndex = index;
    // Torna todos os outros quizzes inativos
    quizzes.forEach((quiz, idx) => {
        quiz.isActive = (idx === index);
    });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    alert(`Quiz "${quizzes[index].title}" selecionado como ativo.`);
}

function editQuiz(index) {
    // Função para editar um quiz (será implementada na próxima etapa)
    alert('Função de edição será implementada em seguida.');
}

function viewActiveQuiz() {
    const activeQuizDetailsContainer = document.getElementById('active-quiz-details');
    activeQuizDetailsContainer.innerHTML = '';  // Limpa os detalhes atuais do quiz
    
    if (activeQuizIndex === null) {
        alert('Nenhum quiz foi selecionado como ativo.');
        return;
    }
    
    const activeQuiz = quizzes[activeQuizIndex];
    const quizTitleElement = document.createElement('h3');
    quizTitleElement.textContent = activeQuiz.title;
    activeQuizDetailsContainer.appendChild(quizTitleElement);
    
    activeQuiz.questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p><strong>Pergunta ${index + 1}:</strong> ${question.questionText}</p>
            <p>Opções: ${question.options.join(', ')}</p>
            <p>Resposta Correta: ${question.correctAnswer}</p>
        `;
        
        activeQuizDetailsContainer.appendChild(questionElement);
    });
}

// Carrega a lista de quizzes quando a página é carregada
window.onload = updateQuizList;

function editQuiz(index) {
    const quizToEdit = quizzes[index];
    const editQuizTitleInput = document.getElementById('edit-quiz-title');
    const editQuestionsContainer = document.getElementById('edit-questions-container');
    
    // Carrega o título do quiz na modal
    editQuizTitleInput.value = quizToEdit.title;
    
    // Limpa o container de perguntas
    editQuestionsContainer.innerHTML = '';
    
    // Carrega as perguntas do quiz na modal
    quizToEdit.questions.forEach((question, questionIndex) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <label>Pergunta: </label>
            <input type="text" class="edit-question form-control edit-question mb-2" value="${question.questionText}" required>
            <label>Opções: </label>
            <input type="text" class="edit-options form-control edit-question mb-2" value="${question.options.join(', ')}" required>
            <label>Resposta Correta: </label>
            <input type="text" class="edit-correct-answer form-control edit-question mb-2" value="${question.correctAnswer}" required>
            <button type="button" class="btn btn-danger btn-sm remove-question-btn">Remover Pergunta</button>
        `;
        questionElement.className = 'form-group border p-3 mb-3';
        editQuestionsContainer.appendChild(questionElement);
    });
    
    // Abre a modal de edição
    $('#editQuizModal').modal('show');
    
    // Adiciona um listener ao botão de salvar alterações
    document.getElementById('save-changes-btn').addEventListener('click', () => saveChanges(index));
}

// Função para adicionar uma nova pergunta na modal de edição
document.getElementById('edit-add-question-btn').addEventListener('click', () => {
    const editQuestionsContainer = document.getElementById('edit-questions-container');
    
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
        <label>Pergunta: </label>
        <input type="text" class="edit-question form-control edit-question mb-2" required>
        <label>Opções: </label>
        <input type="text" class="edit-options form-control edit-question mb-2" required>
        <label>Resposta Correta: </label>
        <input type="text" class="edit-correct-answer form-control edit-question mb-2" required>
        <button type="button" class="btn btn-danger btn-sm remove-question-btn">Remover Pergunta</button>
    `;
    questionElement.className = 'form-group border p-3 mb-3';
    editQuestionsContainer.appendChild(questionElement);
});

function saveChanges(index) {
    const editedQuizTitle = document.getElementById('edit-quiz-title').value;
    const editedQuestionsElements = document.querySelectorAll('#edit-questions-container > div');
    
    const editedQuestions = Array.from(editedQuestionsElements).map(element => {
        const questionText = element.querySelector('.edit-question').value;
        const options = element.querySelector('.edit-options').value.split(',');
        const correctAnswer = element.querySelector('.edit-correct-answer').value;
        
        return {
            questionText,
            options,
            correctAnswer
        };
    });
    
    // Atualiza o quiz com as informações editadas
    quizzes[index].title = editedQuizTitle;
    quizzes[index].questions = editedQuestions;
    
    // Atualiza os quizzes no LocalStorage
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    // Atualiza a lista de quizzes na página
    updateQuizList();
    
    // Fecha a modal de edição
    $('#editQuizModal').modal('hide');
    
    alert('Alterações salvas com sucesso!');
}


function deleteQuiz(quizIndex) {
    // Confirmar a ação do usuário para evitar exclusões acidentais
    const confirmDelete = confirm('Tem certeza de que deseja excluir este quiz? Esta ação não pode ser desfeita.');
    if (confirmDelete) {
        // Remover o quiz correspondente do array de quizzes
        quizzes.splice(quizIndex, 1);
        
        // Salvar os quizzes atualizados no LocalStorage
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        
        // Verificar se o quiz excluído era o quiz ativo
        if (activeQuizIndex === quizIndex) {
            activeQuizIndex = null;
            localStorage.removeItem('activeQuizIndex');
        }
        
        // Atualizar a lista de quizzes criados na interface do usuário
        // AQUI VAMOS ATUALIZAR A LISTA DE QUIZZES DE ACORDO COM O SEU CÓDIGO
        updateQuizList();
    }
}
});

function viewQuiz(quizIndex) {
    // Obter o quiz selecionado
    const selectedQuiz = quizzes[quizIndex];
    
    // Criar o conteúdo do modal para visualizar o quiz
    let quizContent = '<h5>' + selectedQuiz.title + '</h5>';
    selectedQuiz.questions.forEach((question, index) => {
        quizContent += '<div><strong>Q' + (index + 1) + ':</strong> ' + question.questionText + '</div>';
        quizContent += '<div>Opções: ' + question.options.join(', ') + '</div>';
        quizContent += '<div>Resposta Correta: ' + question.correctAnswer + '</div>';
        quizContent += '<hr>';
    });
    
    // Mostrar o modal com o conteúdo do quiz
    const quizModal = document.getElementById('quizModal');
    const quizModalContent = document.getElementById('quizModalContent');
    quizModalContent.innerHTML = quizContent;
    quizModal.style.display = 'block';
}

// Função para fechar o modal de visualização do quiz
function closeQuizModal() {
    const quizModal = document.getElementById('quizModal');
    quizModal.style.display = 'none';
}

function viewActiveQuiz() {
    // Obter o quiz ativo
    const activeQuiz = quizzes[activeQuizIndex];
    
    // Verificar se há um quiz ativo
    if (activeQuiz) {
        // Criar o conteúdo para visualizar o quiz
        let quizContent = '<h5>' + activeQuiz.title + '</h5>';
        activeQuiz.questions.forEach((question, index) => {
            quizContent += '<div><strong>Q' + (index + 1) + ':</strong> ' + question.questionText + '</div>';
            quizContent += '<div>Opções: ' + question.options.join(', ') + '</div>';
            quizContent += '<div>Resposta Correta: ' + question.correctAnswer + '</div>';
            quizContent += '<hr>';
        });
        
        // Inserir o conteúdo do quiz no elemento com o ID 'active-quiz-details'
        const activeQuizDetailsElement = document.getElementById('active-quiz-details');
        activeQuizDetailsElement.innerHTML = quizContent;
    } else {
        alert('Nenhum quiz está ativo no momento.');
    }
}

// Conectar o botão com o ID 'view-active-quiz-btn' à função 'viewActiveQuiz'
document.getElementById('view-active-quiz-btn').addEventListener('click', viewActiveQuiz);
