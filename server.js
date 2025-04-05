import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post('/api/task', async (req, res) => {
  try {
    const prompt = `Сгенерируй одно задание по Excel. Укажи: 1) сочетание клавиш (например, Ctrl+Z), 2) его описание (например, Отменить последнее действие). Ответ в формате JSON с ключами "cmd" и "desc".`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    const text = completion.data.choices[0].message.content;
    const json = JSON.parse(text);
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Ошибка генерации задания' });
  }
});

app.listen(3001, () => console.log('Сервер запущен на http://localhost:3001'));
