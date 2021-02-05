const express = require('express');
const morgan = require('morgan');
const route = require('./app/routes');
const path = require('path');
const handlebars = require('express-handlebars');

const app = express();
const port = 3300;


//Http logger
app.use(morgan('combined'));
//static file
app.use('/public',express.static(path.join(__dirname, "/public")));
//view engine
app.engine('hbs', handlebars({
    extname: '.hbs'
}));
app.set("view engine", 'hbs');
app.set("views", path.join(__dirname, 'app/views'));


//Route
route(app);
 
app.listen(port, ()=>{
    console.log("Connected Port:", port);
});