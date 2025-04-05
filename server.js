console.log("Сервер запускается...");
console.log("API Key:", process.env.OPENAI_API_KEY ? "Есть" : "Нет");
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();

// Настройка CORS для разрешения запросов с ваших доменов
const corsOptions = {
  origin: [
    'https://excel-ninja-ape4.vercel.app',
    'https://excel-ninja-ape4-git-main-denituranovs-projects.vercel.app',
    'http://localhost:3000' // Для локальной разработки
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// Проверка работоспособности API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Генерация задания для Excel
app.post('/api/task', async (req, res)
process.on('unhandledRejection', (err) => {
  console.error('Необработанная ошибка:', err);
});
