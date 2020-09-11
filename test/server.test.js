const knex = require('knex')
const app = require('../src/app');
const supertest = require('supertest')
const { expect } = require('chai');

describe('Workouts API', function () {
  let db;
  let workouts = [
    { "id": 1, "user_id": 1, "workouts_name": "Workout1", "total_length": 10, "workout_type": "AMRAP" },
    { "id": 2, "user_id": 1, "workouts_name": "Workout2", "total_length": 10, "workout_type": "AMRAP" },
    { "id": 3, "user_id": 2, "workouts_name": "Workout2", "total_length": 15, "workout_type": "EMOM" },
    { "id": 4, "user_id": 1, "workouts_name": "Workout2", "total_length": 10, "workout_type": "AMRAP" },
    { "id": 5, "user_id": 5, "workouts_name": "Workout2", "total_length": 20, "workout_type": "EMOM" }
  ]

  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  });
  
  before('cleanup', () => db.raw('TRUNCATE TABLE workouts RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE workouts RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy()); 

  describe('GET /api/workouts', () => {

    beforeEach('insert some workouts', () => {
      return db('workouts').insert(workouts);
    })

    it('should respond to GET `/api/workouts` with an array of workouts and status 200', function () {
      return supertest(app)
        .get('/api/workouts')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(workouts.length);
        });
    });

  });

  describe('GET /api/workout/:id', () => {

    beforeEach('insert some workouts', () => {
      return db('workouts').insert(workouts);
    })

    it('should return correct workout when given an id', () => {
      let workout;
      return db('workouts')
        .first()
        .then(workout => {
          workout = workout
          return supertest(app)
            .get(`/api/workouts/${workout.id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'user_id', 'workouts_name', 'total_length', 'workout_type');
        });
    });

    it('should respond with a 404 when given an invalid id', () => {
      return supertest(app)
        .get('/api/workouts/aaaaaaaaaaaa')
        .expect(404);
    });
    
  });

  
  describe('POST /api/workouts', function () {

    it('should create and return a new workout when provided valid data', function () {
      const newWorkout = {
        'id': 1,
        'user_id': 1,
        'workouts_name': 'test name',
        'total_length': 10,
        'workout_type': 'EMOM'
      };

      return supertest(app)
        .post('/api/workouts')
        .send(newWorkout)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badWorkout = {
        foobar: 'broken item'
      };
      return supertest(app)
        .post('/api/workouts')
        .send(badWorkout)
        .expect(400);
    });

  });

  describe('DELETE /api/workouts/:id', () => {

    beforeEach('insert some workouts', () => {
      return db('workouts').insert(workouts);
    })

    it('should delete a workout by id', () => {
      return db('workouts')
        .first()
        .then(workout => {
          return supertest(app)
            .delete(`/api/workouts/${workout.id}`)
            .expect(204);
        })
    });

    it('should respond with a 404 for an invalid id', function () {
      
      return supertest(app)
        .delete('/api/workouts/aaaaaaaaaaaaaaaaaaaaaaaa')
        .expect(404);
    });

  });

});

describe('Users API', function () {
  let db
  let users = [
    { "id": 1, "email": "test@gmail.com", "password": "Testpassword1", "first_name": "TestUser"},
    { "id": 2, "email": "test@gmail.com", "password": "Testpassword1", "first_name": "TestUser"},
    { "id": 3, "email": "test@gmail.com", "password": "Testpassword1", "first_name": "TestUser"}
  ]

  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  });
  
  before('cleanup', () => db.raw('TRUNCATE TABLE users RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE users RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy()); 

  describe('GET /api/users', () => {

    beforeEach('insert some users', () => {
      return db('users').insert(users);
    })

    it('should respond to GET `/api/users` with an array of users and status 200', function () {
      return supertest(app)
        .get('/api/users')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(users.length);
        });
    });
  });

  describe('POST /api/users', function () {

    it('should create and return a new user when provided valid data', function () {
      const newUser = {
        'id': 4,
        'email': 'newuser@gmail.com',
        'password': 'NewPassword2',
        'first_name': 'NewUser'
      };

      return supertest(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badUser = {
        foobar: 'broken user'
      };
      return supertest(app)
        .post('/api/users')
        .send(badUser)
        .expect(400);
    });

  });
});

describe('Exercises API', function () {
  let db
  let exercises = [
    { "id": 1, "title": "test", "description": "test description", "is_arms": 1, "is_legs": 0, "is_back": 0, "is_chest": 0, "is_core": 0, "is_cardio": 0, "is_advanced": 0 },
    { "id": 2, "title": "test", "description": "test description", "is_arms": 1, "is_legs": 0, "is_back": 0, "is_chest": 0, "is_core": 0, "is_cardio": 0, "is_advanced": 0 }
  ]

  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  });
  
  before('cleanup', () => db.raw('TRUNCATE TABLE exercises RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE exercises RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy()); 

  describe('GET /api/exercises', () => {

    beforeEach('insert some exercises', () => {
      return db('exercises').insert(exercises);
    })

    it('should respond to GET `/api/exercises` with an array of exercises and status 200', function () {
      return supertest(app)
        .get('/api/exercises')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(exercises.length);
        });
    });
  });

  describe('POST /api/exercises', function () {

    it('should create and return a new exercise when provided valid data', function () {
      const newExercise = {
        'id': 1,
        'title': 1,
        'description': 'test desc',
        'is_arms': 0,
        'is_legs': 0,
        'is_back': 0,
        'is_chest': 1,
        'is_core': 0,
        'is_cardio': 1,
        'is_advanced': 0
      };

      return supertest(app)
        .post('/api/exercises')
        .send(newExercise)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badExercise = {
        foobar: 'broken exercise'
      };
      return supertest(app)
        .post('/api/exercises')
        .send(badExercise)
        .expect(400);
    });
  });
});

describe('Workout Details API', function () {
  let db
  let workoutDetails = [
    { "id": 1, "workouts_id": 1, "exercises_id": 3, "exercise_reps": 10 },
    { "id": 2, "workouts_id": 1, "exercises_id": 5, "exercise_reps": 10 },
    { "id": 3, "workouts_id": 1, "exercises_id": 10, "exercise_reps": 20 }
  ]

  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  });
  
  before('cleanup', () => db.raw('TRUNCATE TABLE workout_details RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE workout_details RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy()); 

  describe('GET /api/workoutdetails', () => {

    beforeEach('insert some workout details', () => {
      return db('workout_details').insert(workoutDetails);
    })

    it('should respond to GET `/api/workoutdetails` with an array of workout details and status 200', function () {
      return supertest(app)
        .get('/api/workoutdetails')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
        });
    });
  });
});
