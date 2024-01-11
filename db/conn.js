const mongoose = require('mongoose');

// Connection URL
const url = process.env.MONGO_URL || '';


function connect(callback) {

    console.log('Connecting to MongoDB...' + url);

    mongoose.connection
    .on('error', console.log)
    .on('disconnected', console.log)
    .once('open', callback);

    return mongoose.connect(url, {
        authSource: 'admin',
        user: process.env.MONGO_USERNAME,
        pass: process.env.MONGO_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true});
}   

// Export the connection object
module.exports = connect;
