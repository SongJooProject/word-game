let questions = [];
let currentQuestion = 0;
let score = 0;
let answers = [];
let gameMode = 'preset';

async function loadQuestions() {
    const response = await fetch('data/questions.json');
    const data = await response.json();
    return data;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateRandomSentence(wordPool) {
    const templates = [
        { template: "오늘 __ 이/가 __ 입니다.", blanks: 2 },
        { template: "나는 __ 에서 __ 합니다.", blanks: 2 },
        { template: "__ 은/는 __ 이/가 됩니다.", blanks: 2 },
        { template: "__ 이/가 __ 하여 __ 입니다.", blanks: 3 }
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    const blanks = [];
    
    const noun1 = wordPool.nouns[Math.floor(Math.random() * wordPool.nouns.length)];
    const noun2 = wordPool.nouns[Math.floor(Math.random() * wordPool.nouns.length)];
    const adj = wordPool.adjectives[Math.floor(Math.random() * wordPool.adjectives.length)];
    
    blanks.push(noun1);
    blanks.push(adj);
    if (template.blanks === 3) {
        blanks.push(noun2);
    }
    
    return {
        template: template.template,
        blanks: blanks,
        hint: "랜덤 생성 문제"
    };
}

async function startGame(mode) {
    gameMode = mode;
    const data = await loadQuestions();
    
    if (mode === 'preset') {
        questions = shuffleArray(data.sentences).slice(0, 10);
    } else {
        questions = [];
        for (let i = 0; i < 10; i++) {
            questions.push(generateRandomSentence(data.wordPool));
        }
    }
    
    currentQuestion = 0;
    score = 0;
    
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = questions.length;
    
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    const sentenceEl = document.getElementById('sentence');
    const hintEl = document.getElementById('hint');
    const inputsEl = document.getElementById('inputs');
    const messageEl = document.getElementById('message');
    
    document.getElementById('question-num').textContent = currentQuestion + 1;
    
    let sentenceHtml = q.template;
    q.blanks.forEach((_, i) => {
        sentenceHtml = sentenceHtml.replace('__', `<span class="blank" data-index="${i}">______</span>`);
    });
    sentenceEl.innerHTML = sentenceHtml;
    
    hintEl.textContent = `힌트: ${q.hint}`;
    
    inputsEl.innerHTML = '';
    q.blanks.forEach((_, i) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `answer-${i}`;
        input.placeholder = `${i + 1}번 답`;
        inputsEl.appendChild(input);
    });
    
    messageEl.textContent = '';
    messageEl.className = 'message';
    
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('next-btn').style.display = 'none';
    
    document.getElementById('answer-0').focus();
}

function checkAnswer() {
    const q = questions[currentQuestion];
    let correctCount = 0;
    
    q.blanks.forEach((correctAnswer, i) => {
        const userAnswer = document.getElementById(`answer-${i}`).value.trim();
        const blankEl = document.querySelector(`.blank[data-index="${i}"]`);
        
        if (userAnswer === correctAnswer) {
            correctCount++;
            blankEl.style.color = '#28a745';
            blankEl.textContent = correctAnswer;
        } else {
            blankEl.style.color = '#dc3545';
            blankEl.textContent = userAnswer || '(미입력)';
        }
    });
    
    const messageEl = document.getElementById('message');
    if (correctCount === q.blanks.length) {
        score += 10;
        messageEl.textContent = '정답입니다!';
        messageEl.className = 'message correct';
    } else {
        messageEl.textContent = `틀렸습니다. 정답: ${q.blanks.join(', ')}`;
        messageEl.className = 'message wrong';
    }
    
    document.getElementById('score').textContent = score;
    
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= questions.length) {
        alert(`게임 종료! 최종 점수: ${score}점`);
        return;
    }
    
    showQuestion();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const submitBtn = document.getElementById('submit-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (submitBtn.style.display !== 'none') {
            checkAnswer();
        } else if (nextBtn.style.display !== 'none') {
            nextQuestion();
        }
    }
});
