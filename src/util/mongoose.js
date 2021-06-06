module.exports = {
    multipleMongooseToObject: function(mongooses) {
        return mongooses.map(mongoose => mongoose.toObject());
    },
    multipleMongooseToObjectOnLimit: function(mongooses, limit) {
        return mongooses.slice(0, limit).map(mongoose => mongoose.toObject());
    },
    singleMongooseToObject: function(mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
};