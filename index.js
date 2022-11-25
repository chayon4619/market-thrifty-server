require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w79fzld.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const categoryCollection = client.db('marketThriftyDB').collection('categoryOption');
        const phonesCollection = client.db('marketThriftyDB').collection('phoneCollection');
        const usersCollection = client.db('marketThriftyDB').collection('usersCollection');
        const bookingCollection = client.db('marketThriftyDB').collection('bookingCollection');


        // jwt
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '7d' });
            res.send({ token })
        })

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
            const query = { categoryName: id };

            const phones = phonesCollection.find(query);
            const result = await phones.toArray();
            res.send(result)
        });

        // seller product
        app.get('/seller-product', async (req, res) => {
            const email = req.query.email;
            const query = { sellerEmail: email };
            const result = await phonesCollection.find(query).toArray();
            res.send(result)
        });

        app.delete('/seller-product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await phonesCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/allphones', async (req, res) => {
            const phone = req.body;
            const result = await phonesCollection.insertOne(phone);
            res.send(result);
        })

        // booking 
        app.get('/booking', verifyJWT, async (req, res) => {
            const decoded = req.decoded;

            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'unauthorized access' })
            }
            const email = req.query.email;
            const query = { email: email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        // user
        app.get('/users', verifyJWT, async (req, res) => {
            const query = {}
            const users = usersCollection.find(query);
            const result = await users.toArray();
            res.send(result)
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


        // seller
        app.get('/seller', async (req, res) => {
            const query = { option: "Seller" };
            const seller = await usersCollection.find(query).toArray()
            res.send(seller)

        });

        app.delete('/seller/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)
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