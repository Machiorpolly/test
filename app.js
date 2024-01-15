const express = require("express");
const api = require("./routes/api");
var bodyParser = require("body-parser");
var multer = require("multer");
var forms = multer();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", api);
app.use("/Images", express.static("./uploads"));

module.exports = app;
