require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const exercisesRouter = require('./exercises/exercises-router')
const usersRouter = require('./users/users-router')
const workoutsRouter = require('./workouts/workouts-router')
const todoRouter = require('./todo/todo-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use(express.static('public'))

app.use('/api/todo', todoRouter)
app.use('/api/exercises', exercisesRouter)
app.use('/api/users', usersRouter)
app.use('/api/workouts', workoutsRouter)
app.use(errorHandler)

module.exports = app