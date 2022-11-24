require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w79fzld.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const categoryCollection = client.db('marketThriftyDB').collection('categoryOption');
        const phonesCollection = client.db('marketThriftyDB').collection('phoneCollection');
        const usersCollection = client.db('marketThriftyDB').collection('usersCollection');


        // category
        app.get('/category', async (req, res) => {
            const query = {}
            const category = categoryCollection.find(query);
            const result = await category.toArray();
            res.send(result)
        });

        // phone
        app.get('/allphones/:id', async (req, res) => {
            const id = req.params.id
            const query = { categoryId: id }
            const phones = phonesCollection.find(query);
            const result = await phones.toArray();
            res.send(result)
        });

        // user

        app.get('/users', async (req, res) => {
            const query = {}
            const users = usersCollection.find(query);
            const result = await users.toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.log)

app.get('/', async (req, res) => {
    res.send('Market Thrifty server is running');
})

app.listen(port, () => console.log(`Market Thrifty running on ${port}`))