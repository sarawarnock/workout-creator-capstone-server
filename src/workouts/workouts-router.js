const path = require('path')
const express = require('express')
const xss = require('xss')
const WorkoutsService = require('./workouts-service')
const ExercisesService = require('../exercises/exercises-service')
const WorkoutDetailsService = require('../workout-details/workout-details-service')

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
        let {
            is_advanced,
            is_arms,
            is_back,
            is_cardio,
            is_chest,
            is_core,
            is_legs,
            total_length,
            workout_type,
            workouts_name
        } = req.body

        total_length = parseInt(total_length)

        let newWorkout = {
            user_id: "1",
            //workouts_name: "Test Workout",
	        total_length,
            workout_type,
            workouts_name
        }
        const knexInstance = req.app.get('db')
        ExercisesService.getExercises(knexInstance)
            .then(exercises => {
                // console.log('/////////', exercises)
                // res.json(exercises.map(serializeExercise))
                let selectedExercises = []
                //if category is selected by user AND ==0 then .splice()
                for (let i=0; i<exercises.length; i++) {
                    // console.log('loop function', exercises[i], i+1)
                    
                    // if ((is_advanced == "") && (exercises[i].is_advanced == 1)) {
                    //     exercises[i].splice
                    // }
                    if ((is_advanced == "on") && (exercises[i].is_advanced == 1) && (exercises[i].is_arms == 1)) {
                        selectedExercises.push(exercises[i])
                    }
                    else if ((is_advanced == "on") && (exercises[i].is_advanced == 1) && (exercises[i].is_legs == 1)) {
                        selectedExercises.push(exercises[i])
                    }
                    // else if ((is_advanced == "on") && (exercises[i].is_advanced == 1)) {
                    //     selectedExercises.push(exercises[i])
                    // }
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
                //console.log('**********', selectedExercises)
                //Create randomization logic 
                // let workoutExercises = selectedExercises[Math.floor(Math.random()*selectedExercises.length)];

                function shuffle(array) {
                    var currentIndex = array.length, temporaryValue, randomIndex;
                  
                    // While there remain elements to shuffle...
                    while (0 !== currentIndex) {
                  
                      // Pick a remaining element...
                      randomIndex = Math.floor(Math.random() * currentIndex);
                      currentIndex -= 1;
                  
                      // And swap it with the current element.
                      temporaryValue = array[currentIndex];
                      array[currentIndex] = array[randomIndex];
                      array[randomIndex] = temporaryValue;
                    }
                  
                    return array;
                }

                let outputExercises = []
                let numberExercisesAvailable = selectedExercises.length
                let numberExercisesToSelect = 1
                let shuffledSelectedExercises = shuffle(selectedExercises)

                //console.log(shuffledSelectedExercises)
                console.log(total_length, workout_type)

                if((total_length == "5") && (workout_type == "EMOM")) {
                    outputExercises.push(shuffledSelectedExercises[0])
                }

                if((total_length == "5") && (workout_type == "AMRAP")) {
                    //check if the maximum number of exercises available is matching the current number of exercises necessary
                    if (numberExercisesAvailable < 2) {
                        numberExercisesToSelect = numberExercisesAvailable
                    } else {
                        numberExercisesToSelect = 2
                    }
                    //add to the output exercises each one of the selected exercises which were already shuffled
                    for (let i = 0; i < numberExercisesToSelect; i++) {
                        outputExercises.push(shuffledSelectedExercises[i]) 
                    }
                }

                if ((total_length == "10") && (workout_type == "AMRAP" || "EMOM")) {
                    //check if the maximum number of exercises available is matching the current number of exercises necessary
                    if (numberExercisesAvailable < 2) {
                        numberExercisesToSelect = numberExercisesAvailable
                    } else {
                        numberExercisesToSelect = 2
                    }
                    //add to the output exercises each one of the selected exercises which were already shuffled
                    for (let i = 0; i < numberExercisesToSelect; i++) {
                        outputExercises.push(shuffledSelectedExercises[i]) 
                    }
                }

                if ((total_length == "15") && (workout_type == "AMRAP" || "EMOM")) {
                    //check if the maximum number of exercises available is matching the current number of exercises necessary
                    if (numberExercisesAvailable < 3) {
                        numberExercisesToSelect = numberExercisesAvailable
                    } else {
                        numberExercisesToSelect = 3
                    }
                    //add to the output exercises each one of the selected exercises which were already shuffled
                    for (let i = 0; i < numberExercisesToSelect; i++) {
                        outputExercises.push(shuffledSelectedExercises[i]) 
                    }
                }

                if ((total_length == "20") && (workout_type == "AMRAP" || "EMOM")) {
                    //check if the maximum number of exercises available is matching the current number of exercises necessary
                    if (numberExercisesAvailable < 4) {
                        numberExercisesToSelect = numberExercisesAvailable
                    } else {
                        numberExercisesToSelect = 4
                    }
                    //add to the output exercises each one of the selected exercises which were already shuffled
                    for (let i = 0; i < numberExercisesToSelect; i++) {
                        outputExercises.push(shuffledSelectedExercises[i]) 
                    }
                }

                if ((total_length == "25") && (workout_type == "AMRAP" || "EMOM")) {
                    //check if the maximum number of exercises available is matching the current number of exercises necessary
                    if (numberExercisesAvailable < 5) {
                        numberExercisesToSelect = numberExercisesAvailable
                    } else {
                        numberExercisesToSelect = 5
                    }
                    //add to the output exercises each one of the selected exercises which were already shuffled
                    for (let i = 0; i < numberExercisesToSelect; i++) {
                        outputExercises.push(shuffledSelectedExercises[i]) 
                    }
                }

                if ((total_length == "30") && (workout_type == "AMRAP" || "EMOM")) {
                    //check if the maximum number of exercises available is matching the current number of exercises necessary
                    if (numberExercisesAvailable < 6) {
                        numberExercisesToSelect = numberExercisesAvailable
                    } else {
                        numberExercisesToSelect = 6
                    }
                    //add to the output exercises each one of the selected exercises which were already shuffled
                    for (let i = 0; i < numberExercisesToSelect; i++) {
                        outputExercises.push(shuffledSelectedExercises[i]) 
                    }
                }
                
                return outputExercises
            })
            //After workout POSTed return the list of exercises that were filtered, selected, and randomized
            .then(outputExercises => {
                console.log(outputExercises)
                // Insert a new workout in the 'workouts' table 
                WorkoutsService.insertWorkout(
                    req.app.get('db'),
                    newWorkout
                )
                    .then(workout => {
                    // Randomize the exercise reps based on the workout_type and workout_length
                    function getRandomArbitrary(min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min)) + min;
                    }
                    // let exercise_reps = 1
                    // if ((workout_type == "EMOM") && (total_length == "5")) {
                    //     exercise_reps = 10
                    // }
                    // else if ((workout_type == "AMRAP") && (total_length == "5")) {
                    //     exercise_reps = getRandomArbitrary(5, 10)
                    // }
                    // else if ((workout_type == "EMOM") && (total_length == "10")) {
                    //     exercise_reps = getRandomArbitrary(8, 12)
                    // }
                    // else if ((workout_type == "AMRAP") && (total_length == "10")) {
                    //     exercise_reps = getRandomArbitrary(5, 10)
                    // }
                    // else if ((workout_type == "AMRAP") && (total_length == "30")) {
                    //     exercise_reps = getRandomArbitrary(7, 19)
                    // }
                    // return exercise_reps
                    // For each one of the outputExercises, add them into the 'workout_details' table using the workout_id from above
                    let insertOutputExercises = outputExercises.map(outputExercise => {

                    let exercise_reps = 1
                    if ((workout_type == "EMOM") && (total_length == "5")) {
                        exercise_reps = 8
                    }
                    else if ((workout_type == "AMRAP") && (total_length == "5")) {
                        exercise_reps = getRandomArbitrary(5, 10)
                    }
                    else if ((workout_type == "EMOM") && (total_length == "10")) {
                        exercise_reps = getRandomArbitrary(5, 10)
                    }
                    else if ((workout_type == "AMRAP") && (total_length == "10")) {
                        exercise_reps = getRandomArbitrary(5, 20)
                    }
                    else if ((workout_type == "EMOM") && (total_length == "15")) {
                        exercise_reps = getRandomArbitrary(5, 10)
                    }
                    else if ((workout_type == "AMRAP") && (total_length == "15")) {
                        exercise_reps = getRandomArbitrary(10, 25)
                    }
                    else if ((workout_type == "EMOM") && (total_length == "20")) {
                        exercise_reps = getRandomArbitrary(5, 15)
                    }
                    else if ((workout_type == "AMRAP") && (total_length == "20")) {
                        exercise_reps = getRandomArbitrary(5, 20)
                    }
                    else if ((workout_type == "EMOM") && (total_length == "25")) {
                        exercise_reps = getRandomArbitrary(5, 15)
                    }
                    else if ((workout_type == "AMRAP") && (total_length == "25")) {
                        exercise_reps = getRandomArbitrary(10, 25)
                    }
                    else if ((workout_type == "EMOM") && (total_length == "30")) {
                        exercise_reps = getRandomArbitrary(5, 15)
                    }
                    else if ((workout_type == "AMRAP") && (total_length == "30")) {
                        exercise_reps = getRandomArbitrary(10, 30)
                    }

                        let workoutDetailsPayload = {
                            workouts_id: workout.id,
	                        exercises_id: outputExercise.id,
	                        exercise_reps
                        }
                        console.log(workoutDetailsPayload)
                        return WorkoutDetailsService.insertWorkoutDetails(
                            req.app.get('db'),
                            workoutDetailsPayload
                        )
                    }) 
                        // res
                        //     .status(201)
                        //     // .location(path.posix.join(req.originalUrl, `/${workout.id}`))
                        //     .json(serializeWorkout(workout))
                    })
                    .catch(next)


                
                res
                    .status(201)
                    //.location(path.posix.join(req.originalUrl, `/${workout.id}`))
                    .json({outputExercises})
            })
            .catch(next)
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

workoutsRouter
    .route('/user/:user_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.user_id))) {
            return res.status(404).json({
                error: { message: `Invalid id` }
            })
        }
        WorkoutsService.getWorkoutByUserId(
            req.app.get('db'),
            req.params.user_id
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
        res.json(res.workout)
    })
    .delete((req, res, next) => {
        WorkoutsService.deleteWorkout(
            req.app.get('db'),
            req.params.user_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = workoutsRouter