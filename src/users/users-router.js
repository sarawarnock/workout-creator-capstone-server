const express = require('express')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')

//All users
usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(user => {
                // console.log('User:', user)
                res.json(user)
            })
            .catch(next)
    })
    //post a new user upon signing up
    .post(jsonBodyParser, (req, res, next) => {
        const { email, password, first_name } = req.body

        //console.log("email:", email, "password:", password);

        for (const field of ['email', 'password', 'first_name'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        const passwordError = UsersService.validatePassword(password)

        //console.log("password error:", passwordError);

        if (passwordError)
            return res.status(400).json({ error: passwordError })

            //Check to see if the username/email is taken
            UsersService.hasUserWithUserName(
            req.app.get('db'),
            email
        )
            .then(hasUserWithUserName => {

                // console.log("hasUserWithUserName:", hasUserWithUserName);

                if (hasUserWithUserName)
                    return res.status(400).json({ error: `Username already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        // console.log("hashedpassword", hashedPassword);
                        const newUser = {
                            email,
                            password: hashedPassword,
                            first_name
                        }
                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                // console.log("user:", user)
                                res
                                    .status(201)
                                    .json(
                                        UsersService.serializeUser(user),
                                    )
                            })
                    })
            })
            .catch(next)
    })

//Individual users by id
usersRouter
    // .route('/:user_id')
    // .all((req, res, next) => {
    //     const { user_id } = req.params;
    //     UsersService.getById(req.app.get('db'), user_id)
    //         .then(user => {
    //             if (!user) {
    //                 return res
    //                     .status(404)
    //                     .send({ error: { message: `User doesn't exist.` } })
    //             }
    //             res.user = user
    //             next()
    //         })
    //         .catch(next)
    // })
    // .get((req, res) => {
    //     res.json(UsersService.serializeUser(res.user))
    // })
    // .delete((req, res, next) => {
    //     const { user_id } = req.params;
    //     UsersService.deleteUser(
    //         req.app.get('db'),
    //         user_id
    //     )
    //         .then(numRowsAffected => {
    //             res.status(204).end()
    //         })
    //         .catch(next)
    // })

    .route('/:user_id')
    .all(requireAuth)
    .get((req, res, next) => {
        // console.log(req)
        UsersService.getById(req.app.get('db'), req.user.id)
        .then(user => {
            res.json(UsersService.serializeUser(user))
        })
        .catch(next)
    })

module.exports = usersRouter