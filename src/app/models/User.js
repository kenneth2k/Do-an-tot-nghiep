const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const User = new Schema({
    password: { type: String },
    fullname: { type: String },
    slug: { type: String, slug: 'fullname', unique: true },
    phone: { type: String },
    email: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
    otp: { type: String, default: null },
    decentralization: { type: String, default: 1 },
    token: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);