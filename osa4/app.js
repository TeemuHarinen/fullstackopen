const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
// const middleware = require('middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('Connecting to', config.MONGODB_URL)
mongoose.connect(config.MONGODB_URL)
  .then(() => {
    logger.info('Connected to MONGODB')
  })
  .catch((error) => {
    logger.error('Error connecting to MONGODB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
module.exports = app