const router = require('express').Router()
const Ingredient = require('../data/Ingredient')
const debug = require('debug')('app:IngredientsRouter')

router.get('/', async function(req,res) {
    const ingredients = await Ingredient.find()
    res.send({
        data: ingredients
    })
})



module.exports = router