const puppeteer = require('puppeteer');
const download = require('../download');
const sharp = require("sharp");
const { Rembg } = require("rembg-node");

const { NO_BACKGROUND_CONSTANT } = require('../../constants/imageTypes');
const { uploadImage } = require('../s3');

const MENU_ITEM_IMAGE_CONSTANT = 'Imagens'
const CONTAINER_IMAGES_RESULT_CONSTANT = 'islrc'
const FIRST_IMAGE_CONSTANT = 'PNCib'
const SELECT_IMAGE_CONSTANT = 'iPVvYb'

const removeBgFromImage = async (image) => {
  const input = sharp(image);

  const rembg = new Rembg({
    logging: true,
  });

  const output = await rembg.remove(input);

  await output.png().toFile(image);
}

const scrape = async (imageType, prompt) => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto('https://google.com');

  const searchInput = await page.waitForSelector('#APjFqb');
  await searchInput.type(prompt);

  // Search for the image
  await page.keyboard.press('Enter');

  // Wait for the image to load
  await page.waitForNavigation();

  // Select the item menu with has a content of 'Imagens'
  const [imagesItemMenu] = await page.$x(`//a[contains(., '${MENU_ITEM_IMAGE_CONSTANT}')]`);
  await imagesItemMenu.click();

  // Wait for the images to load
  await page.waitForNavigation();

  // Get the images container
  const imagesContainer = await page.waitForSelector(`.${CONTAINER_IMAGES_RESULT_CONSTANT}`);

  // Get the first image
  const firstImage = (await imagesContainer.$$(`.${FIRST_IMAGE_CONSTANT}`)).shift();

  // Click on the first image
  await firstImage.click();

  // Get the image
  const image = await page.waitForSelector(`.${SELECT_IMAGE_CONSTANT}`);
  const srcImage = await page.evaluate(el => el.src, image);

  const destination = await download(srcImage, `./temp/${prompt.replace(/ /g, '_')}.png`);

  if (imageType === NO_BACKGROUND_CONSTANT) {
    await removeBgFromImage(destination);
  }

  await browser.close();

  await uploadImage({ destination, prompt });
};

module.exports = scrape;