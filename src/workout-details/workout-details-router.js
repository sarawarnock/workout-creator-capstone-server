const path = require('path')
const express = require('express')
const xss = require('xss')
const WorkoutDetailsService = require('./workout-details-service')

const workoutDetailsRouter = express.Router()
const jsonParser = express.json()

const serializeWorkoutDetails = workoutDetails => ({
  id: workoutDetails.id,
  title: xss(workoutDetails.title),
  completed: workoutDetails.completed
})

workoutDetailsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    WorkoutDetailsService.getWorkoutDetails(knexInstance)
      .then(workoutDetails => {
        res.json(workoutDetails.map(serializeWorkoutDetails))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id, workouts_name, total_length } = req.body
    const newWorkoutDetails = { user_id, workouts_name, total_length }

    for (const [key, value] of Object.entries(newWorkoutDetails))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newWorkoutDetails.workouts_name = name;  

    WorkoutDetailsService.insertWorkoutDetails(
      req.app.get('db'),
      newWorkoutDetails
    )
      .then(workoutDetails => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${workoutDetails.id}`))
          .json(serializeTodo(workoutDetails))
      })
      .catch(next)
  })

workoutDetailsRouter
  .route('/:workoutDetails_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.workoutDetails_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    TodoService.getWorkoutDetailsById(
      req.app.get('db'),
      req.params.workoutDetails_id
    )
      .then(workoutDetails => {
        if (!workoutDetails) {
          return res.status(404).json({
            error: { message: `Workout Details don't exist` }
          })
        }
        res.workoutDetails = workoutDetails
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeWorkoutDetails(res.workoutDetails))
  })
  .delete((req, res, next) => {
    WorkoutDetailsService.deleteWorkoutDetails(
      req.app.get('db'),
      req.params.workoutDetails_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_id, workouts_name, total_length } = req.body
    const workoutDetailsToUpdate = { user_id, workouts_name, total_length }

    const numberOfValues = Object.values(workoutDetailsToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'user_id', 'workouts_name' or 'total_length'`
        }
      })

    WorkoutDetailsService.updateWorkoutDetails(
      req.app.get('db'),
      req.params.workoutDetails_id,
      workoutDetailsToUpdate
    )
      .then(updatedWorkoutDetails => {
        res.status(200).json(serializeTodo(updatedWorkoutDetails[0]))
      })
      .catch(next)
  })

module.exports = WorkoutDetailsService