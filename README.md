<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Character Creator</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #1b1b2f;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    input, textarea {
      width: 300px;
      margin-bottom: 1rem;
      padding: 0.5rem;
      font-size: 1rem;
    }
    button {
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      background-color: #3a86ff;
      border: none;
      color: white;
      cursor: pointer;
    }
    img {
      margin-top: 2rem;
      max-width: 100%;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0,0,0,0.4);
    }
  </style>
</head>
<body>
  <h1>🧙 Character Generator</h1>
  <textarea id="traits" placeholder="Type your character's traits here..." rows="6"></textarea>
  <button onclick="generateCharacter()">Generate Character</button>
  <div id="result"></div>

  <script>
    async function generateCharacter() {
      const traits = document.getElementById("traits").value;
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = "Generating...";

      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: traits })
      });

      const data = await response.json();
      resultDiv.innerHTML = `<img src="${data.imageUrl}" alt="Generated Character"/>`;
    }
  </script>
</body>
</html>

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
