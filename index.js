const express = require('express');
const createPrompt = require('./services/scrapper/createPrompt');
const scrape = require('./services/scrapper');

const { IMAGE_TYPES } = require('./constants/imageTypes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {

  const { brand, model, year, color } = req.body;

  // Get from S3 bucket;


  // If not found, create the prompt
  const prompt = createPrompt({ brand, model, year, color });

  // Scrape the images
  await Promise.all(IMAGE_TYPES.map(async (imageType) => {
    return await scrape(imageType, prompt[imageType]);
  }));

  // Upload to S3 bucket

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});