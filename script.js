let currentCommand = null;
let score = 0;
let streak = 0;

const startBtn = document.getElementById('startBtn');
const taskEl = document.getElementById('task').querySelector('.card-content');
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
        const response = await fetch('https://excel-ninja-ape4.vercel.app/api/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка получения задания:', error);
        return null;
    }
}


async function startTraining() {
    const newTask = await fetchTaskFromGPT();
    if (newTask) {
        currentCommand = newTask;
        taskEl.textContent = `Что делает сочетание клавиш: ${currentCommand.cmd}?`;
        userInput.value = '';
        feedbackEl.textContent = '';
    } else {
        taskEl.textContent = 'Не удалось загрузить задание.';
    }
}

function checkAnswer() {
    const userAnswer = userInput.value.trim().toLowerCase();
    const correctAnswer = currentCommand?.desc?.trim().toLowerCase();

    if (!userAnswer || !correctAnswer) return;

    if (userAnswer === correctAnswer) {
        feedbackEl.textContent = '✅ Верно!';
        feedbackEl.style.color = 'var(--success)';
        score += 10;
        streak++;
    } else {
        feedbackEl.textContent = `❌ Неверно. Ответ: ${currentCommand.desc}`;
        feedbackEl.style.color = 'var(--error)';
        streak = 0;
    }

    scoreEl.textContent = score;
    streakEl.textContent = streak;
    setTimeout(startTraining, 1500);
}
