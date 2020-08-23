# Workout Creator Capstone Client

This app creates workouts based on user selected muscle group, time domain and workout type. 

## Working Prototype
You can access a working prototype of the React app here: https://workout-creator-capstone-client.vercel.app/ and Node app here: https://workout-creator-server.herokuapp.com/


## User Stories
This app is for two types of users; a visitor, and a logged-in user

#### Landing Page
* as a visitor
* I want to understand what I can do with this app (or sign up, or log in)
* so I can decide if I want to use it

#### Sign Up
* as a visitor
* I want to register to use this app
* so I can create a workout

#### Create Account Page
* As a visitor
* I want to create a username and password
* So I can create my own account

#### Login Page
* As a user with an account
* I want to log in to my account
* So I can create a workout or view my saved workouts

#### Navbar
* As a user with an account
* I want to be able to nagivate to different sections of the app
* So I can easily see all of my personal info

#### Personal Home Page
* As a user with an account
* I want to have a personal homepage with buttons for “Saved Workouts” and “New Workout”
* So I can redo an old workout, or create a new workout

#### Past Workouts Page
* As a user with an account
* I want to view my past workouts
* So I can use them again

#### View Past Workout
* As a user with an account
* I want to view a specific past workout when I click the "View" button in my Past Workouts list
* So I can do a past workout again

#### Create New Workout
* As a user with an account
* I want to create a new workout → I want to choose the length and the body parts I want to work
* So I can have a complete workout

#### Current Workout
* As a user with an account
* I want to view my new workout and be able to edit the time domain and muscle groups
* So I can begin my workout!

#### Forgot Password
* As a user with an account
* I want to update/change my password when I forget it
* So that I can log back into my account


### Wireframes
Landing/Login Page 
:-------------------------:
![Landing Page](/github-images/wireframes/landing-page.jpg) 
Sign Up Page
![Sign Up Page](/github-images/wireframes/sign-up.jpg)
Login Page
![Login Page](/github-images/wireframes/user-login.jpg)
Forgot Password Page
![Forgot Password Page](/github-images/wireframes/forgot-password.jpg)
Personalized Home Page
![Personalized Home Page](/github-images/wireframes/personalized-home-page.jpg)
Create Workout Page
![Create Workout Page](/github-images/wireframes/create-workout.jpg)
Past Workouts Page
![Past Workouts Page](/github-images/wireframes/past-workouts.jpg)
View Past Workout Page
![View Past Workout Page](/github-images/wireframes/view-past-workout.jpg)


## Screenshots
Landing/Login Page 
:-------------------------:
![Landing Page](/github-images/screenshots/landing-page.png)
Sign Up Page
![Sign Up Page](/github-images/screenshots/sign-up.png) 
Login Page
![Login Page](/github-images/screenshots/log-in.png) 
Create Workout Page
![Create Workout Page](/github-images/screenshots/create-workout.png) 
Past Workouts Page
![Past Workouts Page](/github-images/screenshots/past-workouts.png) 


## Functionality
The app's functionality includes:
* Every User has the ability to create a workout 
* the form to choose and create a workout
    * inputs
        * time interval (5, 10, 15, 20, 25, 30 minutes)
        * workout repetition type (AMRAP (As Many Rounds As Possible), EMOM (Every Minute On the Minute))
        * muscle groups (arms, legs, back, chest, core, cardio, advanced movements)
    * output
        * workout id
        * a set of exercises that get selected based upon the muscles groups chosen in the input, a randomized number of repetitions, based upon the time interval and type of workout.

## Front-end Structure - React Components Map
* __Index.js__ (stateless)
    * __App.js__ (stateful)
        * __header.js__ (stateless)
        * __landing-page.js__ (stateful) - gets the _"prop name"_ and the _"callback prop name"_ from the __App.js__
            * __login.js__ (stateful) -
            * __sign-up.js__ (stateful) -
        * __navbar.js__ (stateless) -
        * __personalized-home-page.js__ (stateless) -
        * __past-workouts.js__ (stateless) -
            * __view-past-workout.js__ (stateless) -
        * __create-new-workout.js__ (stateful) -
        * __new-workout-created.js__ (stateless) -
        * __button.js__ (stateless -)


## Back End Structure - Business Objects (database structure)

* users
    * id
    * email
    * pass
    * first_name

* exercises
    * id
    * title (varchar)
    * description (text)
    * is_arms (boolean: true or false)
    * is_legs (boolean: true or false)
    * is_back (boolean: true or false)
    * is_chest (boolean: true or false)
    * is_core (boolean: true or false)
    * is_cardio (boolean: true or false)
    * is_advanced (boolean: true or false)

* workouts
    * id
    * user_id
    * workouts_name
    * total_legth (time)
    * workout_type


* workout_details
    * id
    * workout_id
    * exercises_id
    * exercises_reps


## Technology
* Front-End: HTML5, CSS3, JavaScript ES6, React
* Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, Postgres
* Development Environment: Heroku, DBeaver

## API Documentation
API Documentation details: 
* get all users => /api/users
* get users by id => /api/users/:user_id
* get all exercises => /api/exercises
* get exercise by id => /api/exercises/:exercise_id
* get all workouts => /api/workouts
* get workouts by user id => /api/workouts/user/:user_id
* get workout details => /api/workoutdetails
* get workout details by id => /api/workoutdetails/:workoutdetail_id
* get workout details by workout id => /api/workoutdetails/:workout_id
* get workout details and exercises => /api/workoutdetails/workout/
* get workout details and exercises by workout id => /api/workoutdetails/workout/:workout_id
* post new user => /api/users
* post new exercise => /api/exercises
* post new workout => /api/workouts
* post new workout details => /api/workoutdetails
* post auth login => /api/auth/login

## Responsive
App is built to be usable on mobile devices, as well as responsive across mobile, tablet, laptop, and desktop screen resolutions.

## Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* Forgot Password 

## How to run it
Use command line to navigate into the project folder and run the following in terminal

### Local Node scripts
* To install the node project ===> npm install
* To migrate the database ===> npm run migrate -- 1
* To run Node server (on port 8000) ===> npm run dev
* To run tests ===> npm run test

### Local React scripts
* To install the react project ===> npm install
* To run react (on port 3000) ===> npm start
* To run tests ===> npm run test

