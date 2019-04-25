const router = require('express').Router()
const User = require('../../data/User')
const sanitizeBody = require('../../middleware/sanitizeBody')
const authorize = require('../../middleware/auth')
const debug = require('debug')('app:authRouter')

///
/// SIGN UP PAGE
///
router.post('/users', sanitizeBody, async(req,res) => {
    try{
        let newUser = new User(req.sanitizedBody)
        const itExists = !!(await User.countDocuments({
            email: newUser.email
        }))
        debug("Does it exist " + itExists)
        if (itExists){
            return res.status(400).send({
                errors: [{
                    status: 'Bad Request',
                    code: '400',
                    title: 'Validation Error',
                    detail: `Email address '${newUser.email}' is already registered.`,
                    source: {
                        pointer: '/data/attributes/email'
                    }
                }]
            })
        }
        await newUser.save()
        res.status(201).send({
            data: newUser
        })
    }catch (err){
        res.status(500).send({
            errors: [{
                status: 'Internal Server Error',
                code: '500',
                title: 'Problem Saving document to the database.'
            }]
        })
    }
})

//
//  FUNCTION TO UPDATE PASSWORDS, CAN BE EXPANDED TO INCLUDE OTHER INFORMATION.
//
const update = (overwrite = false) => async (req,res) => { 
    try{
        const user = await User.findById( req.user._id)
        user.password = req.sanitizedBody.password 
        // debug(user.password)
        await user.save()
        // debug(user)
        res.status(201).send({
            data:{
                user:user,
                message:"password changed Successfully"
            }       
        })
    }
    catch(err) {
        debug(err)
        res.status(500).send({
            errors: [{
                status: 'Internal Server Error',
                code: '500',
                title: 'Problem Saving document to the database.'
            }]
        })
    }
}

//
//  PASSWORD CHANGING ROUTE
//
router.patch('/users', sanitizeBody, authorize, update((overwrite = false))); 

//
//  LOGIN ROUTE
//
router.post('/users/token', sanitizeBody, async(req,res) => {
    const {email, password} = req.sanitizedBody
    const user = await User.authenticate(email,password)
    if(!user){
        return res.status(404).send({
            error: [
                {
                    status: "Unauthorized",
                    code: "401",
                    title: "Incorrect username or password"
                }
            ]
        })
    }
    res.send({data: user.generateAuthToken()})
})

//
//  USER PROFILE ROUTE
//
router.get('/users/me', authorize ,async(req,res) =>{
    const user = await User.findById(req.user._id)
    res.send({data:user})
})

module.exports = router