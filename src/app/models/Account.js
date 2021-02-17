const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    password: { type: String},
    fullname: { type: String},
    phone: { type: Number},
    email: { type: String},
    gender: { type: String},
    dateOfBirth: { type: Date},
    address: [{
        country: { type: String},
        district: { type: String},
        wards: { type: String},
        filladdress: { type: String},
    }],
    oder: [{
        _id: { type: String},
        date: { type: Date },
        productName: { type: String},
        sum: { type: Number},
        status : { type: Boolean },
    }],
    tokens : [{
        token: { type: String },
    }]
    
});

module.exports = mongoose.model('Account', Account);