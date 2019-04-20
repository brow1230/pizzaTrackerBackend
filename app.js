'use strict'
const debug = require('debug')('app')
const sanitizeMongo = require("express-mongo-sanitize");
const express = require('express');
const app = express();

require('./startup/database.js')()

app.use(sanitizeMongo());
app.use(express.json());
//basic path. not final
// app.use()
app.use('/api/auth', require('./routes/auth/index'))
app.use('/api/ingredients', require('./routes/ingredientsRouter'))
app.use('/api/pizzas', require('./routes/pizzaRouter.js'))
//other path here
//auth path here


const port = process.env.PORT || 3030
app.listen(port, () => {debug(`app.js started, Listening on port ${port}`)} )