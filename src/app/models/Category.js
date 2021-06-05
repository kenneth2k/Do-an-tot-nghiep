const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Category = new Schema({
    name: { type: String },
    slug: { type: String, slug: 'name', unique: true }
}, {
    timestamps: true,
});
// add plugin
mongoose.plugin(slug);
Category.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

module.exports = mongoose.model('Category', Category);