const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Picnic Planner!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})