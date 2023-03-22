const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

//middlewares 
app.use(cors())
app.use(express.json())

// require dotenv 
// db (aircncDB)
//dbCollection (usersCollection)
require('dotenv').config()

app.get('/', (req, res)=>{
    res.send('AirCnC server is running')
})
app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})