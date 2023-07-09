const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const jwt  = require('jsonwebtoken')

//middlewares 
// app.use(cors())
// app.use(express.json())

app.use([cors(), express.json()])

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
        const bookingCollection = client.db('aircncDB').collection('bookingCollection')
        //save user email and jwt 
        app.put('/user/:email', async(req, res)=>{
           try{
            const email = req.params.email
            const user = req.body
            console.log("USER : ",user, "Email: ",email)
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
                expiresIn : '3d'
            })
            res.send({result, token})
           }
           catch(err){
            console.log(err.message)
           }
        })

        // get the role of an user 
        app.get('/user/:email', async(req, res)=>{
            const email = req.params.email
            const query = {email : email}
            const user = await usersCollection.findOne(query)
            res.send(user)
        })

        // Get all users 
        app.get('/users', async(req, res)=>{
            const users = await usersCollection.find().toArray()
            console.log(users)
            res.send(users)
        })


        // save booking data in our database 
        app.post('/bookings', async(req,res) =>{
            try{
                const bookingData = req.body
                console.log(bookingData)
                const result = await bookingCollection.insertOne(bookingData)
                console.log(result)
                res.send( result)
            }
            catch(err){
                console.log(err.message)
                res.send(err.message)
            }
        })

        // get all the bookings of an user 
        app.get('/bookings', async(req,res) => {
            try{
                let query = {}
                const email = req.query.email
                console.log("Email is: ", email)
            if(email){
                 query = {
                    guestEmail: email,
                }
    
            }   
            const booking = await bookingCollection.find(query).toArray()
            res.send(booking)
            }
            catch(err){
                res.send(err.message)
            }
        })


        // Get allBookings for Admin 

        app.get('/allBookings', async(req,res) =>{
            try{
                const bookings = await bookingCollection.find({}).toArray()
                res.send({
                    message: 'success', 
                    data : bookings
                })
            }
            catch(err){
                console.log(err.message)
                res.send({
                    message: err.message
                })
            }

        })
        //add a new home 
        app.post('/homes', async (req, res)=>{
            const homes = req.body;
            const result = await homeCollection.insertOne(homes)
            console.log(result)
            res.send(result)
        })

        // get all homes 
        app.get('/homes', async (req, res)=>{
            const query = {}
            const cursor = homeCollection.find(query)
            const homes = await cursor.toArray()
            res.send(homes)
            
        })

        //get a single home details 
        app.get('/home/:id', async(req, res)=>{
            
            try{
                const id = req.params.id
                const query = { _id: new ObjectId(id) }
                const home = await homeCollection.findOne(query)
                console.log(home)
                if(home == null){
                    res.json('Home not founded')
                }else{
    
                    res.send(home)
                }
            }
            catch(err){
                res.send(err)
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
    res.json('AirCnC server is running')
})
app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})