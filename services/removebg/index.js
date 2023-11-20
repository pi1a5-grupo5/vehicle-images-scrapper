const { Rembg } = require("rembg-node");
console.log('Rembg', Rembg);
const sharp = require("sharp");
console.log('sharp', sharp);


const removeBgFromImage = async (image) => {
  const input = sharp(image);

  const rembg = new Rembg({
    logging: true,
  });

  const output = await rembg.remove(input);

  await output.png().toFile(image);
}

module.exports = {
  removeBgFromImage,
};