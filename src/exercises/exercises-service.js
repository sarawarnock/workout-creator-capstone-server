const ExercisesService = {
    getExercises(db) {
      return db
        .from('exercises')
        .select(
          'exercises.id',
          'exercises.title',
          'exercises.description',
          'exercises.is_arms',
          'exercises.is_legs',
          'exercises.is_chest',
          'exercises.is_back',
          'exercises.is_core',
          'exercises.is_cardio',
          'exercises.is_advanced'
        )
    },
    getExerciseById(db, exercises_id) {
      return db
        .from('exercises')
        .select(
          'exercises.id',
          'exercises.title',
          'exercises.description',
        )
        .where('exercises.id', exercises_id)
        .first()
    },
    //do I need an insert here? No one is going to be inserting exercises except for me
    insertExercise(db, newExercise) {
      return db
        .insert(newExercise)
        .into('exercises')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteExercise(db, exercises_id) {
      return db('exercises')
        .where({'id': exercises_id})
        .delete()
    },
    updateExercise(db, exercises_id, newExercise) {
      return db('exercises')
        .where({id: exercises_id})
        .update(newExercise, returning=true)
        .returning('*')
    }
  
  }
  
  module.exports = ExercisesService