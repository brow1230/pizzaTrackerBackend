const router = require('express').Router()
const User = require('../../data/User')
const sanitizeBody = require('../../middleware/sanitizeBody')
const authorize = require('../../middleware/auth')
const debug = require('debug')('app:authRouter')

router.post('/users', sanitizeBody, async(req,res) => {
    try{
        let newUser = new User(req.sanitzedBody)
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

const update = (overwrite = false) => async (req,res) => { 
    try{
        // debug(req.sanitizedBody)

        const user = await User.findOneAndUpdate(
            req.sanitzedBody.email,
            req.sanitzedBody.password,
            {
                new:true,
                overwrite,
                runValidators:true
            }
        )
        res.status(200).send({
            data:user       
        })
    }
    catch(err) {
        debug(err)
        res.status(404).send({
            data: "error" + err
        })    }
}

router.patch('/users', sanitizeBody, authorize, update((overwrite = false))); 

// router.patch('/users', sanitizeBody, authorize, async(req,res) => {
//     try{
//         debug(req.sanitzedBody.email)


//         // const user = await User.findOneAndUpdate({
//         //     email:sanitzedBody.email,
//         //     password: sanitizedBody.password
//         // })
//         // debug('user :' + user)
//         // console.log('hello')

//         // let newPassword = req.sanitzedBody
//         // await newPassword.save()
//         res.status(201).send({
//             data: 'Password Changed'
//         })
//     }catch (err){
//         res.status(500).send({
//             errors: [{
//                 status: 'Internal Server Error',
//                 code: '500',
//                 title: 'Problem Saving document to the database.'
//             }]
//         })
//     }
// })

router.post('/users/token', sanitizeBody, async(req,res) => {
    const {email, password} = req.sanitzedBody
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

router.get('/users/me', authorize ,async(req,res) =>{
    const user = await User.findById(req.user._id)
    res.send({data:user})
})

module.exports = router