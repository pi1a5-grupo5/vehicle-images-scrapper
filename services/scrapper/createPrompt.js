const { SPLASH_CONSTANT, NO_BACKGROUND_CONSTANT } = require('../../constants/imageTypes')

const createPrompt = ({
  brand = 'Nissan',
  model = 'Versa',
  year = '2020',
  color = 'black'
}) => {
  return {
    [SPLASH_CONSTANT]: `${brand} ${model} ${year} ${color} splash`,
    [NO_BACKGROUND_CONSTANT]: `${brand} ${model} ${year} ${color} transparent background`
  }
}

module.exports = createPrompt