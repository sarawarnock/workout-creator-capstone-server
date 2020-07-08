const path = require('path')
const express = require('express')
const xss = require('xss')
const WorkoutsService = require('./workouts-service')

const workoutsRouter = express.Router()
const jsonParser = express.json()

const serializeWorkout = workouts => ({
  id: workouts.id,
  user_id: workouts.user_id,
  workouts_name: xss(workouts.workouts_name),
  total_length: workouts.total_length
})

workoutsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    WorkoutsService.getWorkouts(knexInstance)
      .then(workouts => {
        res.json(workouts.map(serializeWorkout))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { workouts_name, total_length } = req.body
    const newWorkout = { workouts_name, total_length }

    for (const [key, value] of Object.entries(newWorkout))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    //newWorkout.name = name;  

    WorkoutsService.insertWorkout(
      req.app.get('db'),
      newWorkout
    )
      .then(workout => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${workout.id}`))
          .json(serializeTodo(workout))
      })
      .catch(next)
  })

workoutsRouter
  .route('/:workout_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.workout_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    WorkoutsService.getWorkoutById(
      req.app.get('db'),
      req.params.workout_id
    )
      .then(workout => {
        if (!workout) {
          return res.status(404).json({
            error: { message: `Todo doesn't exist` }
          })
        }
        res.workout = workout
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeWorkout(res.workout))
  })
  .delete((req, res, next) => {
    WorkoutsService.deleteWorkout(
      req.app.get('db'),
      req.params.workout_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { workouts_name, total_length } = req.body
    const workoutToUpdate = { workouts_name, total_length }

    const numberOfValues = Object.values(workoutToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'workouts_name' or 'total_length'`
        }
      })

    WorkoutsService.updateWorkout(
      req.app.get('db'),
      req.params.workout_id,
      workoutToUpdate
    )
      .then(updatedWorkout => {
        res.status(200).json(serializeTodo(updatedWorkout[0]))
      })
      .catch(next)
  })

module.exports = workoutsRouter