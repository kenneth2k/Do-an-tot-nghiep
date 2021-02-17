const express = require('express');
const morgan = require('morgan');
const path = require('path');
const handlebars = require('express-handlebars');
const { multipleMongooseToObject, singleMongooseToObject } = require('./util/mongoose');

const route = require('./app/routes');
const db = require('./app/config/db');


db.connect();



const app = express();
const port = 3300;


//Http logger
// app.use(morgan('combined'));
//static file
app.use('/public',express.static(path.join(__dirname, "/public")));

//middleware
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//view engine
app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
        imageOne: (images) => {
            for(let i = 0; i < images.length; i++){
                return images[i].image;
            }
        },
        convertToVND: (price) => {
            const numberFormat = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',    
            });
            var priceToString = numberFormat.format(price) + '';
            return priceToString.slice(1 , priceToString.length);
        },


    }
}));
app.set("view engine", 'hbs');
app.set("views", path.join(__dirname, 'app/views'));


//Route
route(app);
 
app.listen(port, ()=>{
    console.log("Connected Port:", port);
});