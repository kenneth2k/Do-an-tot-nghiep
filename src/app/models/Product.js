const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Product = new Schema({
    name: { type: String },
    slug: { type: String, slug: 'name', unique: true },
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
    categori: { type: String, default: null },
    hot: { type: Boolean, default: false },
    sale: { type: Number, default: 0 },
    reducers: [{
        _id: { type: String },
    }],
    colors: [{
        _id: { type: String },
        name: { type: String },
        quantity: { type: Number, default: 0 },
        bigImg: { type: String, default: null },
        secImg: { type: Array, default: null },
    }, ],
}, {
    timestamps: true,
});
// add plugin
mongoose.plugin(slug);
Product.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

module.exports = mongoose.model('Product', Product);