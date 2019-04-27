
const logger = require('../startup/logger')
const router = require('express').Router();
const sanitizeBody = require('../middleware/sanitizeBody');
const authorize = require('../middleware/auth')
const authorizeStaff = require('../middleware/staffAuth')
const Pizza = require('../data/Pizza');

router.get('/', async function(req,res) {
    try{
            const pizza = await Pizza.find()
        res.send({
            data:pizza
        })
    }catch(err){
        logger.log("error",err)
    }
})

router.get('/:id', async function (req,res){
    try{
        const pizza = await Pizza.findById({_id:req.params.id})
        logger.log('info',pizza)
        res.send({
            data: pizza
        })
    }
    catch (err){
        resourceNotFound(req,res);
        logger.log('error',err)
    }
})

router.post('/', sanitizeBody, authorizeStaff, async (req,res) => {
    try{
        let newPizza = new Pizza(req.sanitizedBody)
        logger.log('info',newPizza)
        const itExists = !!(await Pizza.countDocuments({
            name: newPizza.name
        }))
        logger.log('info',"Does it exist " + itExists)
        if (itExists){
            return res.status(400).send({
                errors: [{
                    status: 'Bad Request',
                    code: '400',
                    title: 'Validation Error',
                    detail: `There already is a '${newPizza.name}' pizza.`,
                    source: {
                        pointer: '/data/attributes/email'
                    }
                }]
            })
        }
        await newPizza.save()
        res.status(201).send({
            data: newPizza
        })
    }catch (err){
        logger.log('error',err)
        res.status(500).send({
            errors: [{
                status: 'Internal Server Error',
                code: '500',
                title: 'Problem Saving document to the database.'
            }]
        })
    }})

const update = (overwrite = false) => async (req,res) => { 
    try{
        logger.log('info', "name: ",req.params.name)
        const pizza = await Pizza.findOne({name:req.params.name})
        if(!pizza){
            throw new Error ('Pizza Not found')
        }
        const updatedPizza = await Pizza.findByIdAndUpdate(
            pizza._id,
            req.sanitizedBody,
            {
                new:true,
                overwrite,
                runValidators:true,
            }
        )
        res.status(201).send({
            data:{
                pizzaChanged: updatedPizza,
                message:"Pizza Successfully Changed"
            }       
        })
        logger.log('info',"pizza object?: ", '\n', updatedPizza)
        
    }
    catch(err) {
        logger.log('error',err)
        res.status(500).send({
            errors: [{
                status: 'Internal Server Error',
                code: '500',
                title: 'Problem Saving document to the database.'
            }]
        })
    }
}

router.put('/:name', sanitizeBody, authorizeStaff, update((overwrite = true)) )
router.patch('/:name', sanitizeBody, authorizeStaff, update((overwrite = false)) )

router.delete('/:id', authorizeStaff, async function(req,res) {
    try{
        logger.log('info', 'id'+req.params.id)
        await Pizza.findByIdAndDelete(req.params.id)
        res.status(200).send({
            data:{
                messge:"pizza deleted"
            }
        })
    }catch(err){
        logger.log('error',err)
        resourceNotFound(req,res)
    }
})

function resourceNotFound(req,res) {
    res.status(404).send({
        errors: [{
            status: 'Not Found',
            code: '404',
            title: 'Resouce does not exist',
            description: `We could not find a course with the id: ${req.params.id}`
        }]
    })
}

module.exports = router