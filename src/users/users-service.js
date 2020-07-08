const UsersService = {
    getUsers(db) {
      return db
        .from('users')
        .select(
          'users.id',
          'users.email',
          'users.password',
          'users.first_name',
        )
    },
    getUserById(db, user_id) {
      return db
        .from('users')
        .select(
          'users.id',
          'users.email',
          'users.password',
          'users.first_name',
        )
        .where('users.id', user_id)
        .first()
    },
    insertUser(db, newUser) {
      return db
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteUser(db, user_id) {
      return db('users')
        .where({'id': user_id})
        .delete()
    },
    updateUser(db, user_id, newUser) {
      return db('users')
        .where({id: user_id})
        .update(newUser, returning=true)
        .returning('*')
    }
  
  }
  
  module.exports = UsersService