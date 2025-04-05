async function fetchTaskFromGPT() {
  try {
    const API_URL = 'https://excel-ninja-api.vercel.app/api/generate-task';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Network error');
    return await response.json();

  } catch (error) {
    console.error('Using fallback:', error);
    const fallbackTasks = [...]; // Те же задания, что и в backend
    return fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)];
  }
}
