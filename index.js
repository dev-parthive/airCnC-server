const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const jwt  = require('jsonwebtoken')

//middlewares 
app.use(cors())
app.use(express.json())

// require dotenv 
// db (aircncDB)
//dbCollection (usersCollection)
require('dotenv').config()
require('colors')
//database connectino 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afdwhlk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await   client.connect()
        console.log("Databse is connected".yellow)
        //collections  are here 
        const usersCollection = client.db('aircncDB').collection('usersCollection')
        const homeCollection = client.db('aircncDB').collection('homeCollection')
        //save user email and jwet 
        app.put('/user/:email', async(req, res)=>{
           try{
            const email = req.params.email
            const user = req.body
            console.log(user, email)
            //create a filter to update email 
            const filter = {email : email}
             // this option instructs the method to create a document if no documents match the filter
            const options = {upsert : true }
            
    // create a document that sets the plot of the movie
            const updateDoc = {
                $set : user , 

            }
            const result = await  usersCollection.updateOne(filter, updateDoc,  options)
            console.log(result)
            const token = jwt.sign(user, process.env.SECRET_ACCESSTOKEN, {
                expiresIn : '24h'
            })
            res.send({result, token})
           }
           catch(err){
            console.log(err.message)
           }
        })

    }
    catch(err){
        console.log(`${err}`.red);

    }
    finally{
        
    }
    
}
run()


// endpoints


app.get('/', (req, res)=>{
    res.send('AirCnC server is running')
})
app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})