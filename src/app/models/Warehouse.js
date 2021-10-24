const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Warehouse = new Schema({
    idProduct: { type: String, required: true },
    colors: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        quantityAfter: { type: Number, default: 0 },
        quantityPlus: { type: Number, default: 0 },
        sum: { type: Number, default: 0 },
    }, ],
}, {
    timestamps: true,
});
// add plugin
mongoose.plugin(slug);
Warehouse.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

module.exports = mongoose.model('Warehouse', Warehouse);