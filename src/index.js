const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')




require('dotenv').config();
const app = express()

// Middleware to parse JSON bodies
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Used to parse URL-encoded bodies



// Connect to the database
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', () => {
    console.log('error while connecting to db');
});
db.once('open', () => {
    console.log('connected to db');
});

app.listen(process.env.PORT, (err) => {
    if(err) {
        console.log('Some error encountered');
    } else {
        console.log('Server started ');
    }
});