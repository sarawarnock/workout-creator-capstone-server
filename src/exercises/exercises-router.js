const path = require('path')
const express = require('express')
const xss = require('xss')
const ExercisesService = require('./exercises-service')

const exercisesRouter = express.Router()
const jsonParser = express.json()

const serializeExercise = exercises => ({
  id: exercises.id,
  title: xss(exercises.title),
  description: exercises.description
})

exercisesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ExercisesService.getExercises(knexInstance)
      .then(exercises => {
        res.json(exercises)
          //.map(serializeExercise))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, description } = req.body
    const newExercise = { title, description }

    for (const [key, value] of Object.entries(newExercise))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newExercise.description = description;  

    ExercisesService.insertExercise(
      req.app.get('db'),
      newExercise
    )
      .then(exercise => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${exercise.id}`))
          .json(serializeExercise(exercise))
      })
      .catch(next)
  })

exercisesRouter
  .route('/:exercise_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.exercise_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    ExercisesService.getExerciseById(
      req.app.get('db'),
      req.params.exercise_id
    )
      .then(exercise => {
        if (!exercise) {
          return res.status(404).json({
            error: { message: `Exercise doesn't exist` }
          })
        }
        res.exercise = exercise
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeExercise(res.exercise))
  })
  .delete((req, res, next) => {
    ExercisesService.deleteExercise(
      req.app.get('db'),
      req.params.exercise_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, description } = req.body
    const exerciseToUpdate = { title, description }

    const numberOfValues = Object.values(exerciseToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'description'`
        }
      })

    ExercisesService.updateExercise(
      req.app.get('db'),
      req.params.exercise_id,
      exerciseToUpdate
    )
      .then(updatedExercise => {
        res.status(200).json(serializeExercise(updatedExercise[0]))
      })
      .catch(next)
  })

module.exports = exercisesRouter