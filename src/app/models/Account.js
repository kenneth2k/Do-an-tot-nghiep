const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    slug: { type: String},
    password: { type: String},
    fullname: { type: String},
    phone: { type: String},
    email: { type: String},
    gender: { type: String},
    dateOfBirth: { type: Date},
    address: [{
        country: { type: String},
        district: { type: String},
        wards: { type: String},
        filladdress: { type: String},
        active: {type: Boolean},
        phone: { type: String}
    }],
    oders: [{
        _id: { type: String},
        date: { type: Date },
        productName: { type: String},
        sum: { type: Number},
        status : { type: String },
    }],
    token : { type: String },
},{
    timestamps: true,
});

module.exports = mongoose.model('Account', Account);