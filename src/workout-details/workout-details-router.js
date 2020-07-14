const path = require('path')
const express = require('express')
const xss = require('xss')
const WorkoutDetailsService = require('./workout-details-service')

const workoutDetailsRouter = express.Router()
const jsonParser = express.json()

const serializeWorkoutDetails = workout_details => ({
  id: workout_details.id,
  workouts_id: xss(workout_details.workouts_id),
  exercises_id: workout_details.exercises_id,
  exercise_reps: workout_details.exercise_reps
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
    const { workouts_id, exercises_id, exercise_reps } = req.body
    const newWorkoutDetails = { workouts_id, exercises_id, exercise_reps }

    for (const [key, value] of Object.entries(newWorkoutDetails))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    //newWorkoutDetails.workouts_name = name;  

    WorkoutDetailsService.insertWorkoutDetails(
      req.app.get('db'),
      newWorkoutDetails
    )
      .then(workoutDetails => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${workoutDetails.id}`))
          .json(serializeWorkoutDetails(workoutDetails))
      })
      .catch(next)
  })

workoutDetailsRouter
  .route('/:workoutdetails_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.workoutdetails_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    WorkoutDetailsService.getWorkoutDetailsById(
      req.app.get('db'),
      req.params.workoutdetails_id
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
      req.params.workoutdetails_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { workouts_id, exercises_id, exercise_reps } = req.body
    const workoutDetailsToUpdate = { workouts_id, exercises_id, exercise_reps }

    const numberOfValues = Object.values(workoutDetailsToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'workouts_id', 'exercises_id' or 'exercise_reps'`
        }
      })

    WorkoutDetailsService.updateWorkoutDetails(
      req.app.get('db'),
      req.params.workoutdetails_id,
      workoutDetailsToUpdate
    )
      .then(updatedWorkoutDetails => {
        res.status(200).json(serializeWorkoutDetails(updatedWorkoutDetails[0]))
      })
      .catch(next)
  })

module.exports = workoutDetailsRouter