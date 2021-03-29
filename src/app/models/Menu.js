const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Menu = new Schema({
    name: { type: String},
    slug: { type: String},
});

module.exports = mongoose.model('Menu', Menu);