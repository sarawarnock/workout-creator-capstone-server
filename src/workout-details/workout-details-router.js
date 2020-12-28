const path = require('path')
const express = require('express')
const xss = require('xss')
const WorkoutDetailsService = require('./workout-details-service')
const { requireAuth } = require('../middleware/jwt-auth')

const workoutDetailsRouter = express.Router()
const jsonParser = express.json()

const serializeWorkoutDetails = workout_details => ({
  id: workout_details.id,
  workouts_id: xss(workout_details.workouts_id),
  exercises_id: workout_details.exercises_id,
  exercise_reps: workout_details.exercise_reps
})

//Workout Details for all workouts
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

//Get workout details including title and description of exercises
workoutDetailsRouter
  .route('/workout')
  .all((req, res, next) => {
    WorkoutDetailsService.getWorkoutDetailsAndExercises(
      req.app.get('db')
    )
      .then(workoutDetailsAndExercises => {
        if (workoutDetailsAndExercises.rows.length == 0) {
          return res.status(404).json({
            error: { message: `Workout details and exercises don't exist` }
          })
        }
        res.workoutDetailsAndExercises = workoutDetailsAndExercises.rows
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.workoutDetailsAndExercises)
  })

//get workout details based on the workout details ID
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
    res.json(res.workoutDetails)
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

//Get workout details, including exercises title and description, for a particular workout
workoutDetailsRouter
  .route('/workout/:workout_id')
  // .all(requireAuth)
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.workout_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    WorkoutDetailsService.getWorkoutDetailsAndExercisesByWorkoutId(
      req.app.get('db'),
      req.params.workout_id
    )
      // .then(console.log('workout_id:::', req.params.workout_id))
      .then(workoutDetailsAndExercises => {
        // console.log('details::', workoutDetailsAndExercises);
        if (workoutDetailsAndExercises.rows.length == 0) {
          // console.log('workout and exercise rows:', workoutDetailsAndExercises.rows);
          return res.status(404).json({
            error: { message: `Workout details and exercises for workout id don't exist` }
          })
        }
        // console.log('workouts rows::', workoutDetailsAndExercises.rows)
        res.workoutDetailsAndExercises = workoutDetailsAndExercises.rows
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    // console.log('get res::', res.workoutDetailsAndExercises)
    res.json(res.workoutDetailsAndExercises)
  })

module.exports = workoutDetailsRouter