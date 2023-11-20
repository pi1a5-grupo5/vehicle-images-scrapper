const express = require('express');
const createPrompt = require('./services/scrapper/createPrompt');
const scrape = require('./services/scrapper');

const { IMAGE_TYPES } = require('./constants/imageTypes');
const { verifyImageExists, uploadImage } = require('./services/s3');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {

  const {
    brand,
    model,
    year,
    color
  } = req.body;


  if (!brand || !model || !year || !color) {
    return res.status(400).send({
      message: 'Missing parameters',
      status: 400
    });
  }

  // Get from S3 bucket;
  const imageExists = await verifyImageExists({ brand, model, year, color, imageType: IMAGE_TYPES[0] });

  if (imageExists) {
    return res.status(200).send({
      message: 'Image already exists',
      status: 200
    });
  };

  // If not found, create the prompt
  const prompt = createPrompt({ brand, model, year, color });

  // Scrape the images
  await Promise.all(IMAGE_TYPES.map(async (imageType) => {
    return await scrape(imageType, prompt[imageType]);
  }));

  // return created status
  return res.status(201).send({
    message: 'Image created',
    status: 201
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});