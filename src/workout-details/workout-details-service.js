const WorkoutDetailsService = {
    getWorkoutDetails(db) {
      return db
        .from('workout_details')
        .select('*')
    },
    getWorkoutDetailsAndExercises(db) {
      return db.raw(`SELECT	workouts_id, exercises_id, exercise_reps, title, description, total_length FROM workout_details wd LEFT JOIN exercises e2 on wd.exercises_id = e2.id;`); 
    },
    getWorkoutDetailsById(db, workoutdetails_id) {
      return db
        .from('workout_details')
        .select('*')
        .where('workouts_id', workoutdetails_id)
    },
    getWorkoutDetailsAndExercisesByWorkoutId(db, workout_id) {
      return db.raw(`SELECT	workouts_id, exercises_id, exercise_reps, title, description, total_length FROM workout_details wd LEFT JOIN exercises e2 on wd.exercises_id = e2.id WHERE wd.workouts_id = ${workout_id};`); 
    },
    insertWorkoutDetails(db, newWorkoutDetails) {
      return db
        .insert(newWorkoutDetails)
        .into('workout_details')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteWorkoutDetails(db, workoutdetails_id) {
      return db('workout_details')
        .where({'id': workoutdetails_id})
        .delete()
    },
    updateWorkoutDetails(db, workoutdetails_id, newWorkoutDetails) {
      return db('workout_details')
        .where({id: workoutdetails_id})
        .update(newWorkoutDetails, returning=true)
        .returning('*')
    }
  
  }
  
  module.exports = WorkoutDetailsService