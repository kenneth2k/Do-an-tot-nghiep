const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const handlebars = require("express-handlebars");
const route = require("./src/app/routes");
const db = require("./src/app/config/db");
const dotenv = require("dotenv");
const blocks = require("./src/helper/blocks");
// const morgan = require('morgan');
// Connect .env
dotenv.config();
// Connect Database
db.connect();

const app = express();
const port = process.env.PORT || 3300;

//Http logger
// app.use(morgan('combined'));
//static file
app.use("/public", express.static(path.join(__dirname, "/public")));

//middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// override with POST having
app.use(methodOverride("_method"));

//view engine
const helper = {
  extname: ".hbs",
  helpers: blocks,
};
app.engine("hbs", handlebars(helper));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "app/views"));

//Route
route(app);

app.listen(port, () => {
  console.log("Connected Port:", `http://localhost:${port}`);
});
