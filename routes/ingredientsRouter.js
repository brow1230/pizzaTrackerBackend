const router = require('express').Router()
const Ingredient = require('../data/Ingredient')
const authorize = require('../middleware/auth')
const sanitizeBody = require('../middleware/sanitizeBody')
const debug = require('debug')('app: Ingredients Router')

//GET all ingredients
router.get('/', async function(req,res) {
    const ingredients = await Ingredient.find()
    res.send({
        data: ingredients
    })
})

//GET one ingredient
router.get('/:id', async function(req,res){
    try {
        const ingredients = await Ingredient.findById(req.params._id)
        res.send({data:ingredients})
    }
    catch(err){
        resourceNotFound(req,res)
        debug(err)
    }
})

router.post('/:id', sanitizeBody, authorize, async function(){

})

const update = (overwrite = false) => async (req,res) => { 
    try{
        const ingredient = await Ingredient.findOneAndUpdate(
            req.params._id,
            req.sanitizedBody.ingredient,
            {
                new: true,
                overwrite,
                runValidators: true,
            }
        )
        res.status(201).send({
            data:{
                order: ingredient,
                message:"ingredient Successfully Changed"
            }       
        })
        if(!ingredient){
            throw new Error ('Order Not found')
        }
        res.send({data: ingredient})
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

//router to overwrite existing ingredient
router.put('/:id', sanitizeBody,authorize,update((overwrite = true)))

//router to update existing ingredient
router.patch('/:id', sanitizeBody,authorize, update((overwrite = false)))

//delete an ingredient 
router.delete('/:id', sanitizeBody,authorize, function(){
    const ingredient = req.sanitizedBody
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