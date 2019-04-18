
const debug = require('debug')('app:pizzaRouter')
const router = require('express').Router();
const sanitizeBody = require('../middleware/sanitizeBody');
const pizza = require('../data/Pizza');

// router.get('/', async function(req,res) {

// })