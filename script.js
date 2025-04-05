document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const taskEl = document.getElementById('task');
  const feedbackEl = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');
  const streakEl = document.getElementById('streak');

  let score = 0;
  let streak = 0;
  let currentTask = null;

  // Проверка подключения API
  async function checkAPI() {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      console.log('API Status:', data);
      return data.status === 'OK';
    } catch (error) {
      console.error('API Check Failed:', error);
      return false;
    }
  }

  // Генерация новой задачи
  async function generateNewTask() {
    startBtn.disabled = true;
    feedbackEl.textContent = 'Генерация задачи...';
    
    try {
      const response = await fetch('/api/generate-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        currentTask = result.data;
        displayTask();
      } else {
        useFallbackTask();
      }
    } catch (error) {
      console.error('Error:', error);
      useFallbackTask();
    }
  }

  function displayTask() {
    taskEl.innerHTML = `
      <strong>Задача:</strong> ${currentTask.task}
    `;
    feedbackEl.textContent = '';
    startBtn.disabled = false;
  }

  function useFallbackTask() {
    currentTask = {
      task: "Примените денежный формат к ячейкам",
      solution: {
        action: "Форматировать как валюту",
        shortcut: "Ctrl+Shift+$",
        description: "Применяет денежный формат к выделенным ячейкам"
      }
    };
    displayTask();
    feedbackEl.textContent = 'Используется локальная задача';
  }

  // Инициализация
  checkAPI().then(apiAvailable => {
    if (!apiAvailable) {
      feedbackEl.textContent = 'API временно недоступно, используем локальные задачи';
    }
  });

  startBtn.addEventListener('click', generateNewTask);
});
