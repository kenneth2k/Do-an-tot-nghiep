const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String },
    price: { type: Number, default: 0 },
    sreen: { type: String },
    HDH: { type: String },
    CameraAfter: { type: String },
    CamereBefore: { type: String },
    CPU: { type: String },
    RAM: { type: String },
    MemoryIn: { type: String },
    SIM: { type: String },
    Battery: { type: String },
    categori: { type: String },
    hot: { type: Boolean, default: false },
    reducers: [{
        _id: { type: String },
    }],
    colors: [{
        _id: { type: String },
        name: { type: String },
        quantity: { type: Number, default: 0 },
        sale: { type: Number, default: 0 },
        bigImg: { type: String },
        secImg: { type: Array },
    }, ],

}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', Product);