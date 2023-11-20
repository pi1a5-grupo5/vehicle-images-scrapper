const { SPLASH_CONSTANT, NO_BACKGROUND_CONSTANT } = require('../../constants/imageTypes')

const createPrompt = ({
  brand,
  model,
  color
}) => {
  return {
    [SPLASH_CONSTANT]: `${brand} ${model} ${color} splash`,
    [NO_BACKGROUND_CONSTANT]: `${brand} ${model} ${color} transparent background`
  }
}

module.exports = createPrompt