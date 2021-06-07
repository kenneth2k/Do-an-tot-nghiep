module.exports = {
    multipleMongooseToObject: function(mongooses) {
        return mongooses.map(mongoose => mongoose.toObject());
    },
    multipleMongooseToObjectOnLimit: function(mongooses, limit, skip = 0) {
        return mongooses.slice(skip, skip + limit).map(mongoose => mongoose.toObject());
    },
    singleMongooseToObject: function(mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
};