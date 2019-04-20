
const debug = require('debug')('app:pizzaRouter')
const router = require('express').Router();
const sanitizeBody = require('../middleware/sanitizeBody');
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