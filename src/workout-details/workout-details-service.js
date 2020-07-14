const WorkoutDetailsService = {
    getWorkoutDetails(db) {
      return db
        .from('workout_details')
        .select(
          'workout_details.id',
          'workout_details.workouts_id',
          'workout_details.exercises_id',
          'workout_details.exercise_reps'
        )
    },
    getWorkoutDetailsById(db, workoutdetails_id) {
      return db
        .from('workout_details')
        .select(
          'workout_details.id',
          'workout_details.workouts_id',
          'workout_details.exercises_id',
          'workout_details.exercise_reps'
        )
        .where('workout_details.id', workoutdetails_id)
        .first()
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