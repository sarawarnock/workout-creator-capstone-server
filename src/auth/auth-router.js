const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const jsonBodyParser = express.json()
//something here?..
authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {

    const { email, password } = req.body
    const loginUser = { email, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    AuthService.getUserWithUserName(
        req.app.get('db'),
        loginUser.email
      )
      .then(dbUser => {
        console.log('dbUser:', dbUser)
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect email or password',
          })
        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            console.log('compareMatch:', compareMatch)
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect email or password',
              })
              
            const sub = dbUser.email
            const payload = {
              user_id: dbUser.id,
              first_name: dbUser.first_name
            }
            console.log("dbUser:", dbUser)
            console.log('sub:', sub)
            console.log("payload:", payload)
            res.send({
              authToken: AuthService.createJwt(sub, payload),
              userId: dbUser.id,
              first_name: dbUser.first_name
            })
          })
      })
      .catch(next)
})

authRouter
  .post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.userId
  const payload = { user_id: req.user.id }
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  })
})

module.exports = authRouter