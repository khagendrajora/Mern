const express = require('express')
const app = express()
require('dotenv').config()   // to read .env files

require('./db/connection')
const bodyParser = require('body-parser')

const morgen = require('morgan')       //here series must be followed

//morgen is used to show log request
const cors = require('cors')
const testRoute = require('./routes/testRoute')

const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute')
const orderRoute = require('./routes/orderRoute')
// const paymentRoute = require('./routes/paymentRoute')

//middleware
app.use(morgen('dev'))
app.use(bodyParser.json())
app.use('/public/uploads', express.static('public/uploads'))
app.use(cors())

// routes middleware
app.use('/api', testRoute)
app.use('/api', categoryRoute)
app.use('/api', userRoute)
app.use('/api', productRoute)
app.use('/api', orderRoute)
// app.use('/api', paymentRoute)



app.get('/', (req, res) => {
    res.send('welcome to ')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server started on port ${port}`)    // this line is only to give message that the server has been started
})

//npm install cors  for frontend accessing backend server