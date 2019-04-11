'use strict'

// const sanitizeMongo = require("express-mongo-sanitize");
const express = require('express');
const app = express();

// require('./startup/database.js')()

// app.use(sanitizeMongo());
app.use(express.json());
//basic path. not final
app.use('/api/path', require('./routes/pizza.js'))
//other path here
//auth path here



const PORT = process.env.PORT || 3030
app.listen(PORT, () => {console.log(`app.js started, Listening on port ${PORT}`)} )