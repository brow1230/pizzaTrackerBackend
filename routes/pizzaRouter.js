
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

router.get('/:name', async function (req,res){
    try{
        const pizza = await Pizza.findOne({name:req.params.name})
        debug(pizza)
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
        debug("name: ",req.params.name)
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
        debug("pizza object?: ", '\n', updatedPizza)
        
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

router.put('/:name', sanitizeBody, authorizeStaff, update((overwrite = true)) )
router.patch('/:name', sanitizeBody, authorizeStaff, update((overwrite = false)) )

router.delete('/:name', authorizeStaff, async function() {

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