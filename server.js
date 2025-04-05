import express from 'express';
import { OpenAI } from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Настройка CORS
const allowedOrigins = [
  'https://excel-ninja.vercel.app',
  'https://excel-ninja-*.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Генерация задачи Excel
app.post('/api/generate-task', async (req, res) => {
  try {
    const prompt = `
      Придумай задачу для Excel и укажи горячие клавиши для её решения.
      Формат ответа (строго JSON):
      {
        "task": "описание задачи",
        "solution": {
          "action": "необходимое действие",
          "shortcut": "горячие клавиши",
          "description": "что делает это сочетание"
        }
      }
      Примеры задач:
      - Вставка текущей даты
      - Создание таблицы
      - Применение фильтра к данным
      - Копирование формата ячеек
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    });

    const content = completion.choices[0].message.content;
    const taskData = JSON.parse(content);
    
    res.json({
      success: true,
      data: taskData
    });

  } catch (error) {
    console.error('Ошибка генерации задачи:', error);
    res.status(500).json({
      success: false,
      error: 'Не удалось сгенерировать задачу',
      fallback: {
        task: "Скопируйте значение из ячейки выше",
        solution: {
          action: "Копировать сверху",
          shortcut: "Ctrl+D",
          description: "Копирует значение из ячейки выше в текущую"
        }
      }
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS разрешён для: ${allowedOrigins.join(', ')}`);
});
