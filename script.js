let currentCommand = null;
let score = 0;
let streak = 0;

// Получаем элементы DOM
const startBtn = document.getElementById('startBtn');
const taskEl = document.getElementById('task'); // Изменено - убрали .querySelector
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');

// Добавляем обработчики событий
startBtn.addEventListener('click', startTraining);

// Функция для получения задания
async function fetchTaskFromGPT() {
    try {
        const response = await fetch('https://excel-ninja-ape4-git-main-denituranovs-projects.vercel.app/api/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка получения задания:', error);
        // Возвращаем fallback-задание если API не доступно
        const fallbackTasks = [
            { cmd: "Ctrl+C", desc: "копировать выделенное" },
            { cmd: "Ctrl+V", desc: "вставить из буфера обмена" },
            { cmd: "Ctrl+Z", desc: "отменить последнее действие" }
        ];
        return fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)];
    }
}

// Функция начала тренировки
async function startTraining() {
    try {
        const newTask = await fetchTaskFromGPT();
        if (newTask) {
            currentCommand = newTask;
            taskEl.textContent = `Что делает сочетание клавиш: ${currentCommand.cmd}?`;
            feedbackEl.textContent = '';
        } else {
            taskEl.textContent = 'Не удалось загрузить задание. Попробуйте ещё раз.';
        }
    } catch (error) {
        console.error('Ошибка в startTraining:', error);
        taskEl.textContent = 'Произошла ошибка. Обновите страницу.';
    }
}

// Функция проверки ответа
function checkAnswer() {
    const userAnswer = userInput?.value?.trim().toLowerCase();
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
