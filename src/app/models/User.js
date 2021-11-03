const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const User = new Schema({
    password: { type: String },
    fullname: { type: String },
    slug: { type: String, slug: 'fullname', unique: true },
    phone: { type: String, unique: true },
    email: { type: String, unique: true },
    gender: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    addresses: [{
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        active: { type: Boolean, default: false }
    }, ],
    otp: { type: String, default: null },
    role: { type: String, default: 1 },
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