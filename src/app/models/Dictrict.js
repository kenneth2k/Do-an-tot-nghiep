const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Dictrict = new Schema({
    maqh: { type: String },
    name_quanhuyen: { type: String },
    type: { type: String },
    matp: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Dictrict', Dictrict);