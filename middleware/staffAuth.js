const jwt = require('jsonwebtoken')
const jwtPrivateKey = 'superSecureSecret'
const debug = require('debug')('app:auth')
const User = require('../data/User')

const parsetoken = header => {
    if (header) {
        const [type,token] = header.split(' ')
        if(type === 'bearer' && typeof token !== 'undefined'){
            return token
        }
        return undefined
    }
}


module.exports = (req, res, next) => {
  const token = req.header('bearer')
  debug(token)
  if (!token) {
    return res.status(401).send({
      errors: [
        {
          status: 'Unauthorized',
          code: '401',
          title: 'Authentication failed',
          description: 'Missing bearer token'
        }
      ]
    })
  }

  try {
    const payload = jwt.verify(token, jwtPrivateKey)
    req.user = payload

    debug("UserID", req.user)
    // debug(User.find({_id: req.user._id}))

    if(!req.user.isStaff){
        res.status(400).send({
            errors:[{
                status: "Bad Request",
                code: '400',
                title: 'Validation Error',
                description: 'Unauthorized token'
            }]
        })
        return
    }
    next()
  } catch (err) {
      debug(err)
    res.status(400).send({
      errors: [
        {
          status: 'Bad request',
          code: '400',
          title: 'Validation Error',
          description: 'Invalid bearer token'
        }
      ]
    })
  }
}