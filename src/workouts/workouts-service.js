const WorkoutsService = {
    getWorkouts(db) {
      return db
        .from('workouts')
        .select(
          'workouts.id',
          'workouts.user_id',
          'workouts.workouts_name',
          'workouts.total_length',
        )
    },
    getWorkoutById(db, workout_id) {
      return db
        .from('workouts')
        .select(
          'workouts.id',
          'workouts.user_id',
          'workouts.workouts_name',
          'workouts.total_length',
        )
        .where('workouts.id', workout_id)
        .first()
    },
    insertWorkout(db, newWorkout) {
      return db
        .insert(newWorkout)
        .into('workouts')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteWorkout(db, workout_id) {
      return db('workouts')
        .where({'id': workout_id})
        .delete()
    },
    updateWorkout(db, workout_id, newWorkout) {
      return db('workouts')
        .where({id: workout_id})
        .update(newWorkout, returning=true)
        .returning('*')
    }
  
  }
  
  module.exports = WorkoutsService