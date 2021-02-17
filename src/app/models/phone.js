const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Phone = new Schema({
    name: { type: String},
    price: {type: Number, default: 0},
    sreen: { type: String},
    HDH: { type: String},
    CameraAfter: { type: String},
    CamereBefore: { type: String},
    CPU: { type: String},
    RAM: { type: String},
    MemoryIn: { type: String},
    SIM: { type: String},
    Battery: { type: String},
    images: [{
      image: { type: String}
    },],
    createdAt: { type: Date, default: Date.now},
    updateedAt: { type: Date, default: Date.now},
  });

module.exports = mongoose.model('Phone', Phone);

