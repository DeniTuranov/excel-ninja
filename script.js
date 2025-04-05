let currentTask = null;
let score = 0;
let streak = 0;

const startBtn = document.getElementById('startBtn');
const taskEl = document.getElementById('task');
const answerInput = document.getElementById('answerInput');
const checkBtn = document.getElementById('checkBtn');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');

startBtn.addEventListener('click', generateNewTask);
checkBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

async function generateNewTask() {
  try {
    startBtn.disabled = true;
    answerInput.disabled = false;
    checkBtn.disabled = false;
    
    const response = await fetch('https://your-server-url/api/generate-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    currentTask = data;
    
    taskEl.innerHTML = `
      <strong>Задача:</strong> ${data.task}<br><br>
      <strong>Какое действие нужно выполнить?</strong>
    `;
    
    answerInput.value = '';
    answerInput.focus();
    feedbackEl.textContent = '';
    
  } catch (error) {
    console.error('Error:', error);
    taskEl.textContent = 'Не удалось загрузить задание. Попробуйте снова.';
    startBtn.disabled = false;
  }
}

function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = currentTask.solution.action.toLowerCase();

  if (!userAnswer) return;

  if (userAnswer === correctAnswer) {
    feedbackEl.innerHTML = `
      ✅ Верно!<br><br>
      <strong>Решение:</strong> ${currentTask.solution.action}<br>
      <strong>Горячие клавиши:</strong> ${currentTask.solution.shortcut}<br>
      <strong>Описание:</strong> ${currentTask.solution.description}
    `;
    feedbackEl.style.color = '#00b894';
    score += 10;
    streak++;
  } else {
    feedbackEl.innerHTML = `
      ❌ Неверно. Правильный ответ:<br><br>
      <strong>Действие:</strong> ${currentTask.solution.action}<br>
      <strong>Горячие клавиши:</strong> ${currentTask.solution.shortcut}<br>
      <strong>Описание:</strong> ${currentTask.solution.description}
    `;
    feedbackEl.style.color = '#d63031';
    streak = 0;
  }

  scoreEl.textContent = score;
  streakEl.textContent = streak;
  
  startBtn.disabled = false;
  answerInput.disabled = true;
  checkBtn.disabled = true;
}
