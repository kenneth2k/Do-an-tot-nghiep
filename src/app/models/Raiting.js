const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Raiting = new Schema({
    star: { type: Number, required: true },
    proSlug: { type: String, required: true },
    userSlug: { type: String, required: true },
    content: { type: String, required: true },
    images: [],
}, {
    timestamps: true,
});
// add plugin
mongoose.plugin(slug);
Raiting.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

module.exports = mongoose.model('Raiting', Raiting);