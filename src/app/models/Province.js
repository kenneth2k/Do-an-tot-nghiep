const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Province = new Schema({
    matp: { type: String },
    name_city: { type: String },
    type: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Province', Province);