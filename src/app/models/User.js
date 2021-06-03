const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

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
    active: { type: Boolean, default: false },
    activeToken: { type: String, default: null },
    token: { type: String },
}, {
    timestamps: true,
});
// add plugin
mongoose.plugin(slug);
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});
module.exports = mongoose.model('User', User);