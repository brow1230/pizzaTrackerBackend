const router = require('express').Router()
const User = require('../../data/User')
const sanitizeBody = require('../../middleware/sanitizeBody')
// const authorize = require('../../middleware/auth')


router.post('/users', sanitizeBody, async(req,res) => {
    try{
        let newUser = new User(req.sanitzedBody)
        const itExists = !!(await User.countDocuments({
            user: newUser.email
        }))
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
            data: `${newUser}`
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
router.patch('/users', sanitzeBody, async(req,res) => {
    try{
        let newPassword = req.sanitzedBody
        await newPassword.save()
        res.status(201).send({
            data: 'Password Changed'
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
// router.post('/users/tokens', sanitizeBody, async(req,res) => {
//     const {email, password} = req.sanitzedBody
//     const user = await User.authenticate(email,password)
//     if(!user){
//         return res.status(404).send({
//             error: [
//                 {
//                     status: "Unauthorized",
//                     code: "401",
//                     title: "Incorrect username or password"
//                 }
//             ]
//         })
//     }
// })



// router.get('/users/me', authroize,async(req,res) =>{
//     const user = await User.findById(req.user._id)
//     res.send({data:user})
// })

