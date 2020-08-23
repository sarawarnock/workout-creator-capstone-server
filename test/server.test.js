const knex = require('knex')
const app = require('../src/app');
const supertest = require('supertest')
const { expect } = require('chai');

describe('Workouts API:', function () {
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
