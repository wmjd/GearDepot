const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.MONGO_STRING;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connection.on('connecting', () => {
    console.log('Mongoose connecting');
});
connection.on('connected', () => {
    console.log('Mongoose connected');
});
connection.on('error', () => {
    console.log('Mongoose error');
});

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
});

const User = connection.model('User', UserSchema);

module.exports = connection;