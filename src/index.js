const express = require('express');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const { multipleMongooseToObject, singleMongooseToObject } = require('./util/mongoose');

const route = require('./app/routes');
const db = require('./app/config/db');

// Connect Database
db.connect();

const app = express();
const port = 3300;

//Http logger
app.use(morgan('combined'));
//static file
app.use('/public', express.static(path.join(__dirname, "/public")));

//middleware
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// override with POST having
app.use(methodOverride('_method'))

//view engine
app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
        imageOne: (images) => {
            for (let i = 0; i < images.length; i++) {
                return images[i].image;
            }
        },
        convertToVND: (price) => {
            const numberFormat = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            var priceToString = numberFormat.format(price) + '';
            return priceToString.slice(1, priceToString.length);
        },
        genderChecked: (gender) => {
            if (gender == 'Nam') {
                return `
                    <label class="gender-checked">
                        <input type="radio" name="gender" value="Nam" id="male" checked>
                        <span class="label">Nam</span>
                    </label>
                    <label class="gender-checked">
                        <input type="radio" name="gender" value="Nữ" id="female">
                        <span class="label">Nữ</span>
                    </label>`;
            }
            return `
                    <label class="gender-checked">
                        <input type="radio" name="gender" value="Nam" id="male">
                        <span class="label">Nam</span>
                    </label>
                    <label class="gender-checked">
                        <input type="radio" name="gender" value="Nữ" id="female" checked>
                        <span class="label">Nữ</span>
                    </label>`;
        },
        dateToString: (date) => {
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        },
        renderAddress: () => {

        }

    }
}));
app.set("view engine", 'hbs');
app.set("views", path.join(__dirname, 'app/views'));


//Route
route(app);

app.listen(port, () => {
    console.log("Connected Port:", port);
});