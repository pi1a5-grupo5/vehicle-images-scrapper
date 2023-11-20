const { SPLASH_CONSTANT, NO_BACKGROUND_CONSTANT } = require('../../constants/imageTypes')

const createPrompt = ({
  brand,
  model,
  year,
  color
}) => {
  return {
    [SPLASH_CONSTANT]: `${brand} ${model} ${year} ${color} splash`,
    [NO_BACKGROUND_CONSTANT]: `${brand} ${model} ${year} ${color} transparent background`
  }
}

module.exports = createPrompt