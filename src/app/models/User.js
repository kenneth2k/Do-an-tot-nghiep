const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    slug: { type: String },
    password: { type: String },
    fullname: { type: String },
    phone: { type: String },
    email: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
    token: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);