const express = require("express")
const app  = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

require('dotenv').config()
require("colors")
// middle- wares
app.use(cors())
//to get the post data 
app.use(express.json())


//databse connect 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.afdwhlk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function dbConnect(){
    try{
        // akane cesta kora hocce database er sateh connect korar
        await client.connect()
        console.log('database connected..'.yellow.bold)
    }
    catch(err){
        console.log(err.name.bgRed, err.message.bold, err.stack)
    }
}
dbConnect()
// ------------------------

// collections
const userColection = client.db("airCnC").collection("users")






// end point 
app.get('/', (req, res) =>{
    res.send("airCnC server is running......")
})
// port k listen korar jonno 
app.listen(port, () => {
    console.log("server is running......". blue)
})