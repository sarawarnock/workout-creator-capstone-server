require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const authRouter = require('./auth/auth-router')
const exercisesRouter = require('./exercises/exercises-router')
const usersRouter = require('./users/users-router')
const workoutsRouter = require('./workouts/workouts-router')
const workoutDetailsRouter = require('./workout-details/workout-details-router')
const { CLIENT_ORIGIN } = require('./config');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}))

app.use(cors())
const corsOptions = {
  origin: CLIENT_ORIGIN,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.options('*', cors());

app.use(helmet())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use('/api/auth', authRouter)
app.use('/api/exercises', exercisesRouter)
app.use('/api/users', usersRouter)
app.use('/api/workouts', workoutsRouter)
app.use('/api/workoutdetails', workoutDetailsRouter)
app.use(errorHandler)

module.exports = app