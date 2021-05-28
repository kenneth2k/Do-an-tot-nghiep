const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ward = new Schema({
    xaid: { type: String },
    name_xaphuong: { type: String },
    type: { type: String },
    maqh: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Ward', Ward);