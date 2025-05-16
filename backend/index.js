const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

app.listen(config.PORT, (err) => {
  if (err) {
    logger.error(err)
    process.exit(1)
  } else
    logger.info('Server is running on port ', config.PORT)
})

