const ExercisesService = {
    getExercises(db) {
      return db
        .from('exercises')
        .select('*')
    },
    getExerciseById(db, exercises_id) {
      return db
        .from('exercises')
        .select('*')
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