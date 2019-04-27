'use strict'
const logger = require('./startup/logger')
const sanitizeMongo = require("express-mongo-sanitize");
const express = require('express');
const cors = require('cors')
const app = express();
require('./startup/database.js')()

app.use(sanitizeMongo());
app.use(express.json());
app.use(cors())
//basic path. not final
// app.use()
app.use('/api/auth', require('./routes/auth/index'))
app.use('/api/ingredients', require('./routes/ingredientsRouter'))
app.use('/api/pizzas', require('./routes/pizzaRouter'))
app.use('/api/orders', require('./routes/ordersRouter'))
//other path here
//auth path here


const port = process.env.PORT || 8080
app.listen(port, () => {logger.log('info',`app.js started, Listening on port ${port}`)} )