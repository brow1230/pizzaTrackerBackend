const router = require('express').Router()
const debug = require('debug')('app: Orders Router')
const sanitizeBody = require('../middleware/sanitizeBody')
const Order = require('../data/Order')
const authroize = require('../middleware/auth')

//GET all orders
router.get('/', authroize, async function(req,res){
    try{
        // let orders = await Order.find()
        res.send({
            data:{
                message:"success",
                // id: req.User._id
        }})
    }catch(err){
        res.send({data:'failed'})
    }
})

//POST make an order
router.post('/',sanitizeBody, authroize, async function (req,res){
    try{
        const newOrder = new Order(req.sanitizedBody)
        await newOrder.save()
        res.status(201).send({
            data: newOrder
        })
    }catch(err){
        res.status(500).send({
            errors:[{
                status: "Internal Server Error",
                code: "500",
                title: "Problem saving Order to the database"
            }]
        })
    }
})

//GET order details
router.get('/:id', authroize, async function(){
    try{
        const order = await Order.findById(req.params._id)
        res.send({
            data: order
        })
    }catch(err){
        debug(err)
        res.send({
            data:"error...checkconsole."
        })
    }
})

//UPDATE FUNCTION
const update = (overwrite = false) => async (req,res) => { 
    try{
        const order = await Order.findByIdAndUpdate(
            req.params._id,
            req.sanitizedBody,
            {
                new: true,
                overwrite,
                runValidators: true,
            }
        )
        res.status(201).send({
            data:{
                order:order,
                message:"Order Successfully Changed"
            }       
        })
        if(!order){
            throw new Error ('Order Not found')
        }
        res.send({data: order})
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
//PUT (replace) an order
router.put('/:id',sanitizeBody, authroize, update((overwrite = true)))

//PATCH (update) an order 
router.patch('/:id',sanitizeBody, authroize, update((overwrite = false)))


//DELETE (cancel) an order
router.delete('/:id',sanitizeBody, authroize, async function() {

})

module.exports = router