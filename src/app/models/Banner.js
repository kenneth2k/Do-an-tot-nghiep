const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Banner = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: { type: String, required: true },
}, {
    timestamps: true,
});
// add plugin
mongoose.plugin(slug);
Banner.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

module.exports = mongoose.model('Banner', Banner);