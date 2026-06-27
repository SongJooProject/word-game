let currentTopic = 'civil';
let questions = [];
let currentQuestion = 0;
let score = 0;
let attemptCount = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let startTime = null;
let timerInterval = null;

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
    
    // 모바일에서 사이드바 닫기
    document.getElementById('sidebar').classList.remove('open');
}

function startGame() {
    const data = questionsData[currentTopic];
    questions = shuffleArray(data.sentences).slice(0, 5);
    
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    attemptCount = 0;
    
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = questions.length;
    
    // 타이머 시작
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // 통계 표시
    document.getElementById('stats').style.display = 'block';
    
    showQuestion();
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('time').textContent = `${minutes}:${seconds}`;
}

function updateProgress() {
    const progress = (currentQuestion / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResult();
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
        input.setAttribute('aria-label', `${i + 1}번 답 입력`);
        inputsEl.appendChild(input);
    });
    
    messageEl.textContent = '';
    messageEl.className = 'message';
    
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('next-btn').style.display = 'none';
    
    // 문제 카드 애니메이션
    const card = document.getElementById('question-card');
    card.style.animation = 'none';
    card.offsetHeight; // 리플로우 트리거
    card.style.animation = 'slideIn 0.3s ease';
    
    updateProgress();
    
    document.getElementById('answer-0').focus();
}

function checkAnswer() {
    const q = questions[currentQuestion];
    let correctCount = 0;
    
    q.blanks.forEach((correctAnswer, i) => {
        const input = document.getElementById(`answer-${i}`);
        const userAnswer = input.value.trim();
        const blankEl = document.querySelector(`.blank[data-index="${i}"]`);
        
        if (userAnswer === correctAnswer) {
            correctCount++;
            input.classList.add('correct');
            input.classList.remove('wrong');
            blankEl.style.color = '#4ecca3';
            blankEl.textContent = correctAnswer;
        } else {
            input.classList.add('wrong');
            input.classList.remove('correct');
            blankEl.style.color = '#e94560';
            blankEl.textContent = userAnswer || '(미입력)';
        }
    });
    
    const messageEl = document.getElementById('message');
    if (correctCount === q.blanks.length) {
        // 정답
        correctAnswers++;
        score += 10;
        messageEl.textContent = '정답입니다!';
        messageEl.className = 'message correct';
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'inline-block';
        
        // 점수 애니메이션
        const scoreEl = document.getElementById('score');
        scoreEl.classList.add('animate');
        setTimeout(() => scoreEl.classList.remove('animate'), 500);
    } else {
        // 오답
        attemptCount++;
        if (attemptCount >= 5) {
            wrongAnswers++;
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
    updateAccuracy();
}

function updateAccuracy() {
    const total = correctAnswers + wrongAnswers;
    const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function showResult() {
    if (timerInterval) clearInterval(timerInterval);
    
    const total = correctAnswers + wrongAnswers;
    const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-count').textContent = correctAnswers;
    document.getElementById('wrong-count').textContent = wrongAnswers;
    document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    
    document.getElementById('result-modal').style.display = 'flex';
}

function restartGame() {
    document.getElementById('result-modal').style.display = 'none';
    startGame();
}

// 사이드바 토글 (모바일)
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// 주제 선택 이벤트
document.querySelectorAll('.topic-item').forEach(item => {
    item.addEventListener('click', () => {
        selectTopic(item.dataset.topic);
    });
});

// 키보드 네비게이션
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
    
    if (e.key === 'Escape') {
        document.getElementById('sidebar').classList.toggle('open');
    }
});

// 초기 로드
selectTopic('civil');
