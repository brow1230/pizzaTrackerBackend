
const debug = require('debug')('app: Pizza Router')
const router = require('express').Router();
const sanitizeBody = require('../middleware/sanitizeBody');
const authorize = require('../middleware/auth')
const authorizeStaff = require('../middleware/staffAuth')
const Pizza = require('../data/Pizza');

router.get('/', async function(req,res) {
    const pizza = await Pizza.find()
    res.send({
        data:pizza
    })
})

router.get('/:id', async function (req,res){
    try{
        const pizza = await Pizza.findById(req.params._id)
        res.send({
            data: pizza
        })
    }
    catch (err){
        resourceNotFound(req,res);
        debug(err)
    }
})

router.post('/', sanitizeBody, authorizeStaff, async (req,res) => {
    try{
        let newPizza = new Pizza(req.sanitizedBody)
        debug(newPizza)
        const itExists = !!(await Pizza.countDocuments({
            name: newPizza.name
        }))
        debug("Does it exist " + itExists)
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
        debug(err)
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
        const pizza = await Pizza.findOneAndUpdate(
            req.params._id,
            req.sanitizedBody.pizza,
            {
                new: true,
                overwrite,
                runValidators: true,
            }
        )
        res.status(201).send({
            data:{
                order:pizza,
                message:"Pizza Successfully Changed"
            }       
        })
        if(!pizza){
            throw new Error ('Order Not found')
        }
        res.send({data: pizza})
    }
    catch(err) {
        res.status(500).send({
            errors: [{
                status: 'Internal Server Error',
                code: '500',
                title: 'Problem Saving document to the database.'
            }]
        })
    }
}

router.put('/:id', sanitizeBody, authorize, update((overwrite = true)) )
router.patch('/:id', sanitizeBody, authorize, update((overwrite = false)) )

router.delete('/:id', authorize, async function() {

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