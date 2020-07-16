const path = require('path')
const express = require('express')
const xss = require('xss')
const WorkoutsService = require('./workouts-service')
const ExercisesService = require('../exercises/exercises-service')

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
        const {
            is_advanced,
            is_arms,
            is_back,
            is_cardio,
            is_chest,
            is_core,
            is_legs,
            total_length,
            workout_type
        } = req.body
        // //console.log('***********',is_advanced,
        //     is_arms,
        //     is_back,
        //     is_cardio,
        //     is_chest,
        //     is_core,
        //     is_legs,
        //     total_length,
        //     workout_type)
        const knexInstance = req.app.get('db')
        ExercisesService.getExercises(knexInstance)
            .then(exercises => {
                // console.log('/////////', exercises, id)
                // res.json(exercises.map(serializeExercise))
                let selectedExercises = []
                //if category is selected by user AND ==0 then .splice()
                for (let i=0; i<exercises.length; i++) {
                    // console.log('loop function', exercises[i], i+1)
                    
                    if ((is_advanced == "on") && (exercises[i].is_advanced == 1)) {
                        console.log(is_advanced)
                        selectedExercises.push(exercises[i])
                    }
                    else if ((is_arms == "on") && (exercises[i].is_arms == 1)) {
                        selectedExercises.push(exercises[i])
                    }
                    else if ((is_back == "on") && (exercises[i].is_back == 1)) {
                        selectedExercises.push(exercises[i])
                    }
                    else if ((is_cardio == "on") && (exercises[i].is_cardio == 1)) {
                        selectedExercises.push(exercises[i])
                    }
                    else if ((is_chest == "on") && (exercises[i].is_chest == 1)) {
                        selectedExercises.push(exercises[i])
                    }
                    else if ((is_core == "on") && (exercises[i].is_core == 1)) {
                        selectedExercises.push(exercises[i])
                    }
                    else if ((is_legs == "on") && (exercises[i].is_legs == 1)) {
                        selectedExercises.push(exercises[i])
                    }
                }
                console.log('**********', selectedExercises)
                //Create randomization logic 
                return selectedExercises
            })
            // .then(workout => {
            //     res
            //         .status(201)
            //         .location(path.posix.join(req.originalUrl, `/${workout.id}`))
            //         .json({
            //             id: workouts.id,
            //             name: workouts.workouts_name,

            //         })
            //})
            .catch(next)


        // WorkoutsService.insertWorkout(
        //     req.app.get('db'),
        //     newWorkout
        // )
        //     .then(workout => {
        //         res
        //             .status(201)
        //             .location(path.posix.join(req.originalUrl, `/${workout.id}`))
        //             .json(serializeWorkout(workout))
        //     })
        //     .catch(next)
    })

workoutsRouter
    .route('/:workout_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.workout_id))) {
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
                        error: { message: `Workout doesn't exist` }
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
                res.status(200).json(serializeWorkout(updatedWorkout[0]))
            })
            .catch(next)
    })

module.exports = workoutsRouter