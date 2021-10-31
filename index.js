const express = require('express');
const { MongoClient, OrderedBulkOperation } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42wwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {

        await client.connect();
        // console.log('connected to database');

        // database creation if theres none
        const database = client.db('picnicPlanner');
        // collection or simply a table
        const picnicSpotCollection = database.collection('picnicSpots');
        const guideCollection = database.collection('guides');
        const bookingSpotCollection = database.collection('bookings');


        // GET API -  all services
        app.get('/picnicSpots', async (req, res) => {
            const cursor = picnicSpotCollection.find({});
            const picnicSpots = await cursor.toArray();
            res.send(picnicSpots);
        });

        // GET API -  all bookings
        app.get('/bookings', async (req, res) => {
            const cursor = bookingSpotCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        });
        // GET API -  guides
        app.get('/guides', async (req, res) => {
            const cursor = guideCollection.find({});
            const guides = await cursor.toArray();
            res.send(guides);
        });



        // GET API - single spot
        app.get('/picnicSpots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const picnicSpot = await picnicSpotCollection.findOne(query);
            res.json(picnicSpot)
        })

        // add bookings api
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            // console.log('my bookings', bookings);
            const result = await bookingSpotCollection.insertOne(booking);
            res.send(result);
        })


        // put or update  api

        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            // console.log('updating user', id);
            // console.log('updating user req', req);
            // res.send('updating not dating');
            res.json(result);
        })



        // POST API -- services will be added(new)
        app.post('/picnicSpots', async (req, res) => {

            const picnicSpot = req.body;



            // insertion of one data
            const result = await picnicSpotCollection.insertOne(picnicSpot);
            console.log(result);

            // sending the data
            res.json(result)

        });

        // DELETE API
        app.delete('/picnicSpots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await picnicSpotCollection.deleteOne(query);
            res.json(result);

        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Picnic Planner!')
})
app.get('/hello', (req, res) => {
    res.send('hello updated here');
})





app.listen(port, () => {
    console.log('Running picnic planner server on port:', port)
})