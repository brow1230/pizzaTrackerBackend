const router = require('express').Router()
const Ingredient = require('../data/Ingredient')
const authorize = require('../middleware/auth')
const authorizeStaff = require('../middleware/staffAuth')
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

router.post('/', sanitizeBody, authorizeStaff, async function(req,res){
    try{
        let newIngredient = new Ingredient(req.sanitizedBody)
        debug(newIngredient)
        const itExists = !!(await Ingredient.countDocuments({
            name: newIngredient.name
        }))
        debug("Does it exist " + itExists)
        if (itExists){
            return res.status(400).send({
                errors: [{
                    status: 'Bad Request',
                    code: '400',
                    title: 'Validation Error',
                    detail: `There already is a '${newIngredient.name}' Ingredient.`,
                    source: {
                        pointer: '/data/attributes/email'
                    }
                }]
            })
        }
        await newIngredient.save()
        res.status(201).send({
            data: newIngredient
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
    }
})

const update = (overwrite = false) => async (req,res) => { 
    try{
        debug("name: ",req.params.name)
        const ingredient = await Ingredient.findOne({name:req.params.name})
        if(!ingredient){
            throw new Error ('ingredient Not found')
        }
        const updatedingredient = await Ingredient.findByIdAndUpdate(
            ingredient._id,
            req.sanitizedBody,
            {
                new:true,
                overwrite,
                runValidators:true,
            }
        )
        res.status(201).send({
            data:{
                ingredientChanged: updatedingredient,
                message:"ingredient Successfully Changed"
            }       
        })
        debug("ingredient object?: ", '\n', updatedingredient)
        
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
//router to overwrite existing ingredient
router.put('/:name', sanitizeBody, authorizeStaff,update((overwrite = true)))

//router to update existing ingredient
router.patch('/:name', sanitizeBody, authorizeStaff, update((overwrite = false)))

//delete an ingredient 
router.delete('/:id', authorizeStaff, async function(req,res){
    try{
        debug("Ingredient ID"+req.params.id)
        await Ingredient.findByIdAndDelete(req.params.id)
        res.status(200).send({
            data:{
                messge:"ingredient deleted"
            }
        })
    }catch(err){
        debug(err)
        resourceNotFound(req,res)
    }})


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