const WorkoutsService = {
    getWorkouts(db) {
      return db
        .from('workouts')
        .select('*')
    },
    getWorkoutById(db, workout_id) {
      return db
        .from('workouts')
        .select(
          'workouts.id',
          'workouts.user_id',
          'workouts.workouts_name',
          'workouts.total_length',
          'workouts.workout_type'
        )
        .where('workouts.id', workout_id)
        .first()
    },
    getWorkoutByUserId(db, user_id) {
      return db
        .from('workouts')
        .select('*')
        .where('workouts.user_id', user_id)
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