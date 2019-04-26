const jwt = require('jsonwebtoken')
const jwtPrivateKey = 'superSecureSecret'

const parsetoken = header => {
    if (header) {
        const [type,token] = header.split(' ')
        if(type === 'Bearer' && typeof token !== 'undefined'){
            return token
        }
        return undefined
    }
}


module.exports = (req, res, next) => {

  const token = parsetoken(req.header('Authorization'))
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
    next()
  } catch (err) {
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