let currentCommand = null;
let score = 0;
let streak = 0;

const startBtn = document.getElementById('startBtn');
const taskEl = document.getElementById('task');
const userInput = document.getElementById('userInput');
const checkBtn = document.getElementById('checkBtn');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');

startBtn.addEventListener('click', startTraining);
checkBtn.addEventListener('click', checkAnswer);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

async function fetchTaskFromGPT() {
    try {
        const response = await fetch('https://excel-ninja-ape4-git-main-denituranovs-projects.vercel.app/api/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Ошибка сети');
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
        // Fallback данные
        const fallbackTasks = [
            { cmd: "Ctrl+C", desc: "копировать выделенное" },
            { cmd: "Ctrl+V", desc: "вставить из буфера обмена" },
            { cmd: "Ctrl+Z", desc: "отменить последнее действие" }
        ];
        return fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)];
    }
}

async function startTraining() {
    startBtn.disabled = true;
    userInput.disabled = false;
    checkBtn.disabled = false;
    userInput.focus();
    
    const newTask = await fetchTaskFromGPT();
    if (newTask) {
        currentCommand = newTask;
        taskEl.textContent = `Что делает сочетание клавиш: ${currentCommand.cmd}?`;
        userInput.value = '';
        feedbackEl.textContent = '';
    } else {
        taskEl.textContent = 'Не удалось загрузить задание. Попробуйте ещё раз.';
    }
}

function checkAnswer() {
    const userAnswer = userInput.value.trim().toLowerCase();
    const correctAnswer = currentCommand?.desc?.trim().toLowerCase();

    if (!userAnswer) return;

    if (userAnswer === correctAnswer) {
        feedbackEl.textContent = '✅ Верно! +10 баллов';
        feedbackEl.style.color = '#00b894';
        score += 10;
        streak++;
    } else {
        feedbackEl.textContent = `❌ Неверно. Правильно: ${currentCommand.desc}`;
        feedbackEl.style.color = '#d63031';
        streak = 0;
    }

    scoreEl.textContent = score;
    streakEl.textContent = streak;
    
    // Подготовка к следующему вопросу
    startBtn.disabled = false;
    userInput.disabled = true;
    checkBtn.disabled = true;
    
    setTimeout(() => {
        feedbackEl.textContent = 'Нажмите СТАРТ для следующего вопроса';
        feedbackEl.style.color = '';
    }, 2000);
}
