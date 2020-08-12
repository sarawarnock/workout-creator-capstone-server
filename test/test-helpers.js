const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      first_name: 'Test user 1',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      first_name: 'Test user 2',
      password: 'password',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      first_name: 'Test user 3',
      password: 'password',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      first_name: 'Test user 4',
      password: 'password',
    },
  ]
}

function makeExercisesArray() {
    return [
        {
            id: 1,
            title: 'Test Exercise 1',
            description: 'test description',
        },
        {
            id: 2,
            title: 'Test Exercise 2',
            description: 'test description',
        },
        {
            id: 3,
            title: 'Test Exercise 3',
            description: 'test description',
        },
        {
            id: 4,
            title: 'Test Exercise 4',
            description: 'test description',
        },
        {
            id: 5,
            title: 'Test Exercise 5',
            description: 'test description',
        },

    ]
}

function makeWorkoutsArray(users) {
  return [
    {
      id: 1,
      workouts_name: 'First test workout!',
      user_id: users[0].id,
      total_length: 10,
      workout_type: 'EMOM'
    },
    {
      id: 2,
      workouts_name: 'Second test workout!',
      user_id: users[1].id,
      total_length: 15,
      workout_type: 'AMRAP'
    },
    {
      id: 3,
      workouts_name: 'Third test workout!',
      user_id: users[2].id,
      total_length: 20,
      workout_type: 'EMOM'
    },
    {
      id: 4,
      workouts_name: 'Fourth test workout!',
      user_id: users[3].id,
      total_length: 10,
      workout_type: 'AMRAP'
    },
  ]
}

function makeWorkoutDetailsArray(workouts) {
  return [
    {
      id: 1,
      workouts_id: workouts[0].id,
      exercises_id: 1,
      exercises_reps: 10,
    },
    {
      id: 2,
      workouts_id: workouts[0].id,
      exercises_id: 2,
      exercises_reps: 10,
    },
    {
      id: 3,
      workouts_id: workouts[0].id,
      exercises_id: 3,
      exercises_reps: 10,
    },
    {
      id: 4,
      workouts_id: workouts[0].id,
      exercises_id: 3,
      exercises_reps: 10,
    },
    {
      id: 5,
      workouts_id: workouts[0].id,
      exercises_id: 4,
      exercises_reps: 10,
    },
    {
      id: 6,
      workouts_id: workouts[2].id,
      exercises_id: 5,
      exercises_reps: 10,
    },
    {
      id: 7,
      workouts_id: workouts[3].id,
      user_id: 5,
      exercises_reps: 10,
    },
  ];
}

// function makeExpectedWorkout(users, workouts, workoutDetails=[]) {
//   const author = users
//     .find(user => user.id === article.author_id)

//   const number_of_comments = comments
//     .filter(comment => comment.article_id === article.id)
//     .length

//   return {
//     id: article.id,
//     style: article.style,
//     title: article.title,
//     content: article.content,
//     date_created: article.date_created.toISOString(),
//     number_of_comments,
//     author: {
//       id: author.id,
//       user_name: author.user_name,
//       full_name: author.full_name,
//       nickname: author.nickname,
//       date_created: author.date_created.toISOString(),
//       date_modified: author.date_modified || null,
//     },
//   }
// }

function makeWorkoutFixtures() {
  const testUsers = makeUsersArray()
  const testExercises = makeExercisesArray()
  const testWorkouts = makeWorkoutsArray(testUsers)
  const testWorkoutDetails = makeWorkoutDetailsArray(testWorkouts, testExercises)
  return { testUsers, testExercises, testWorkouts, testWorkoutDetails }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        users,
        exercises,
        workouts,
        workoutDetails
      RESTART IDENTITY CASCADE;
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE exercises_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE workouts_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE workoutDetails_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('exercises_id_seq', 0)`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
        trx.raw(`SELECT setval('workouts_id_seq', 0)`),
        trx.raw(`SELECT setval('workoutDetails_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedExerciesTable(exercises) {
    return db.transaction(async trx => {
        await seedUsers(trx, exercises)
        await trx.into('exercises').insert(exercises)
        // update the auto sequence to match the forced id values
        await trx.raw(
          `SELECT setval('exercises_id_seq', ?)`,
          [exercises[exercises.length - 1].id],
        )
    })
}

function seedWorkoutsTable(workouts) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, workouts)
      await trx.into('workouts').insert(workouts)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('workouts_id_seq', ?)`,
        [workouts[workouts.length - 1].id],
      )
    })
}

  function seedWorkoutDetailsTable(workoutDetails) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, workoutDetails)
      await trx.into('workoutDetails').insert(workoutDetails)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('workoutDetails_id_seq', ?)`,
        [workoutDetails[workoutDetails.length - 1].id],
      )
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeExercisesArray,
  makeWorkoutsArray,
  makeWorkoutDetailsArray,

  makeWorkoutFixtures,
  cleanTables,
  seedUsers,
  seedExerciesTable,
  seedWorkoutsTable,
  seedWorkoutDetailsTable,
  makeAuthHeader,
}
