import express from 'express';
import { OpenAI } from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();
const app = express();

// Настройка CORS
app.use(cors({
  origin: [
    'https://excel-ninja.vercel.app',
    'https://excel-ninja-*.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS']
}));

app.use(express.json());

// Инициализация OpenAI с вашим ключом из переменных окружения
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Проверка работы API
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'API работает корректно',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Генерация задания
app.post('/api/generate-task', async (req, res) => {
  try {
    const prompt = `...`; // Ваш промпт
        
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;
    res.json(JSON.parse(content));
    
  } catch (error) {
    console.error('Ошибка OpenAI:', error);
    // Fallback данные
    res.json({
      task: "Скопируйте выделенные ячейки",
      solution: {
        action: "Копировать",
        shortcut: "Ctrl+C",
        description: "Копирует выделенные ячейки в буфер обмена"
      }
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
});
