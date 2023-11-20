const fs = require('fs');
const axios = require('axios');
const { getRandomUserAgent } = require('../../constants/fakeHeaders')

const download = (url, destination) => new Promise(async (resolve, reject) => {
  const file = fs.createWriteStream(destination);

  const response = await axios.get(url, {
    responseType: 'stream',
    headers: {
      'User-Agent': getRandomUserAgent()
    }
  });

  response.data.pipe(file);

  file.on('finish', () => {
    file.close(resolve(destination));
  });

  file.on('error', async error => {
    fs.unlink(destination, (e) => {
      console.error(e, e.message)
    });

    reject(error.message);
  });
});

module.exports = download;