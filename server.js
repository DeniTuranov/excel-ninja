import express from 'express';
import { OpenAI } from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Жёсткая настройка CORS
app.use(cors({
  origin: ['https://excel-ninja.vercel.app'],
  methods: ['POST', 'GET']
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: '1.1.0' });
});

// Генератор задач
app.post('/api/generate-task', async (req, res) => {
  try {
    const prompt = `...`; // Ваш промпт из предыдущего кода
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;
    res.json(JSON.parse(content));
    
  } catch (error) {
    console.error('API Error:', error);
    // Fallback данные
    const fallbackTasks = [...]; // Ваши резервные задания
    res.json(fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)]);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
