import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/generate-task', async (req, res) => {
  try {
    const prompt = `
      Придумай задачу для Excel и укажи правильные горячие клавиши для её решения.
      Формат ответа строго в JSON:
      {
        "task": "описание задачи",
        "solution": {
          "action": "действие для решения",
          "shortcut": "горячая клавиша",
          "description": "описание действия"
        }
      }
      Пример:
      {
        "task": "Выделите весь лист",
        "solution": {
          "action": "Выделить все",
          "shortcut": "Ctrl+A",
          "description": "Выделяет все содержимое листа"
        }
      }
      Генерируй разные задачи: форматирование, формулы, навигация, работа с данными.
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = completion.data.choices[0].message.content;
    const jsonResponse = JSON.parse(content);
    res.json(jsonResponse);
  } catch (error) {
    console.error('Error generating task:', error);
    res.status(500).json({ error: 'Failed to generate task' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
