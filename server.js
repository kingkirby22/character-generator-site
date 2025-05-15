import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY'
});
const openai = new OpenAIApi(configuration);

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const aiResponse = await openai.createImage({
      prompt: `Fantasy character: ${prompt}`,
      n: 1,
      size: "512x512"
    });

    const imageUrl = aiResponse.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed." });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
