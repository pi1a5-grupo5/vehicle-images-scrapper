const AWS = require('aws-sdk');
const fs = require('fs');
const createPrompt = require('../scrapper/createPrompt');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const s3 = new AWS.S3({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const uploadImage = async ({ destination, prompt }) => {
  const {
    brand,
    model,
    color
  } = desestructurePrompt(prompt);


  const fileContent = fs.readFileSync(destination);

  const params = {
    Bucket: 'carllet-car-assets',
    Key: `${brand.toLowerCase()}/${model.toLowerCase()}/${color.toLowerCase()}/${prompt.toLowerCase().replace(/ /g, '_')}.png`,
    Body: fileContent,
    ACL: 'public-read',
    ContentType: 'image/png'
  };

  const uploaded = s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);

    return true;
  });

  return uploaded.promise().then((data) => {
    return data;
  }).catch((err) => {
    throw err;
  }).finally(() => {
    fs.unlinkSync(destination);
  });
};

const verifyImageExists = async ({ brand, model, color, imageType }) => {
  const prompt = createPrompt({ brand, model, color });

  const params = {
    Bucket: 'carllet-car-assets',
    Key: `${brand.toLowerCase()}/${model.toLowerCase()}/${color.toLowerCase()}/${prompt[imageType].toLowerCase().replace(/ /g, '_')}.png`
  };

  const teste = s3.getObject(params, (err, data) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  })

  return teste.promise().then((data) => {
    return true;
  }).catch((err) => {
    return false;
  })
};

const desestructurePrompt = (prompt) => {
  const [brand, model, color] = prompt.split(' ');

  return {
    brand,
    model,
    color
  }
}

module.exports = {
  uploadImage,
  verifyImageExists
};