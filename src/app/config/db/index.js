const mongoose = require('mongoose');

async function connect() {
    try {
        const uri = process.env.DB_CONNECT;
        // const uri = 'mongodb://localhost:27017/ephone_store';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connect success!!!');
    } catch (e) {
        console.log('Error connecting');
    }
}
module.exports = { connect }