require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());



app.get('/', async (req, res) => {
    res.send('Market Thrifty server is running');
})

app.listen(port, () => console.log(`Market Thrifty running on ${port}`))