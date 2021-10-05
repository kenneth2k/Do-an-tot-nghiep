const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Producer = new Schema({
    name: { type: String, required: true, maxLength: 255 },
    email: { type: String, required: true, maxLength: 255 },
    phone: { type: String, required: true, maxLength: 10 },
    address: { type: String, required: true, maxLength: 255 },
}, {
    timestamps: true,
});
// add plugin
mongoose.plugin(slug);
Producer.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

module.exports = mongoose.model('Producer', Producer);