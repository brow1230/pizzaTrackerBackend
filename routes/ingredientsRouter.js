const router = require('express').Router()
const Ingredient = require('../data/Ingredient')
const debug = require('debug')('app:IngredientsRouter')

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