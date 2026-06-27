let currentTopic = 'civil';
let questions = [];
let currentQuestion = 0;
let score = 0;
let attemptCount = 0;

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function selectTopic(topic) {
    currentTopic = topic;
    
    document.querySelectorAll('.topic-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-topic="${topic}"]`).classList.add('active');
    
    document.getElementById('topic-title').textContent = questionsData[topic].title;
    score = 0;
    document.getElementById('score').textContent = score;
}

function startGame() {
    const data = questionsData[currentTopic];
    questions = shuffleArray(data.sentences).slice(0, 5);
    
    currentQuestion = 0;
    score = 0;
    attemptCount = 0;
    
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = questions.length;
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        alert(`게임 종료! 최종 점수: ${score}점`);
        return;
    }
    
    const q = questions[currentQuestion];
    const sentenceEl = document.getElementById('sentence');
    const hintEl = document.getElementById('hint');
    const inputsEl = document.getElementById('inputs');
    const messageEl = document.getElementById('message');
    
    attemptCount = 0;
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
            blankEl.style.color = '#4ecca3';
            blankEl.textContent = correctAnswer;
        } else {
            blankEl.style.color = '#e94560';
            blankEl.textContent = userAnswer || '(미입력)';
        }
    });
    
    const messageEl = document.getElementById('message');
    if (correctCount === q.blanks.length) {
        score += 10;
        messageEl.textContent = '정답입니다!';
        messageEl.className = 'message correct';
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'inline-block';
    } else {
        attemptCount++;
        if (attemptCount >= 5) {
            messageEl.textContent = `5번 틀렸습니다. 정답: ${q.blanks.join(', ')}`;
            messageEl.className = 'message wrong';
            document.getElementById('submit-btn').style.display = 'none';
            document.getElementById('next-btn').style.display = 'inline-block';
        } else {
            messageEl.textContent = `틀렸습니다. (${attemptCount}/5)`;
            messageEl.className = 'message wrong';
        }
    }
    
    document.getElementById('score').textContent = score;
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

// 주제 선택 이벤트
document.querySelectorAll('.topic-item').forEach(item => {
    item.addEventListener('click', () => {
        selectTopic(item.dataset.topic);
    });
});

// Enter 키 이벤트
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

// 초기 로드
selectTopic('civil');
