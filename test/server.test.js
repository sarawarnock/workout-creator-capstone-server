const knex = require('knex')
const app = require('../src/app');
const supertest = require('supertest')
const { expect } = require('chai');

describe('Workouts API:', function () {
  let db;
  let workouts = [
    { "id": 1, "title": "Workout1",   "description": "test description" },
    { "id": 2, "title": "Workout2",  "description": "test description" },
    { "id": 3, "title": "Workout3", "description": "test description" },
    { "id": 4, "title": "Workout4",    "description": "test description" },
    { "id": 5, "title": "Workout5", "description": "test description" }
  ]

  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
    console.log('///////////////////////////////////',process.env.TEST_DATABASE_URL)
  });
  
  //before('cleanup', () => db.raw('TRUNCATE TABLE workouts RESTART IDENTITY;'));

  //afterEach('cleanup', () => db.raw('TRUNCATE TABLE workouts RESTART IDENTITY;')); 

  //after('disconnect from the database', () => db.destroy()); 

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
          // res.body.forEach((item) => {
          //   expect(item).to.be.a('object');
          //   expect(item).to.include.keys('id', 'title', 'completed');
          // });
        });
    });

  });

  describe('GET /api/workout/:id', () => {

    beforeEach('insert some workouts', () => {
      return db('workouts').insert(workouts);
    })

    it('should return correct workout when given an id', () => {
      let doc;
      return db('workouts')
        .first()
        .then(_doc => {
          doc = _doc
          return supertest(app)
            .get(`/api/workouts/${workout.id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'title', 'description');
          expect(res.body.id).to.equal(doc.id);
          expect(res.body.title).to.equal(doc.title);
          expect(res.body.completed).to.equal(doc.completed);
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
        'title': 'New Workout',
        'description': 'new workout desc'
      };

      return supertest(app)
        .post('/api/workouts')
        .send(newWorkout)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'description');
          expect(res.body.title).to.equal(newItem.title);
          expect(res.body.completed).to.be.false;
          expect(res.headers.location).to.equal(`/api/workouts/${res.body.id}`)
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badItem = {
        foobar: 'broken item'
      };
      return supertest(app)
        .post('/api/workouts')
        .send(badItem)
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
