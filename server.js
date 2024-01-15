const express = require("express");
const api = require("./routes/api");
var bodyParser = require("body-parser");

const sequelize = require("./sequelize");
const PORT = process.env.PORT;
const HOST = process.env.HOST;

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize
  .authenticate()
  .then(async () => {
    console.log("Database Connected");

    //await sequelize.sync({ force: true }); // drop (if existing) and create all tables
    //await sequelize.sync({ alter: true }); // alter existing tables
    await sequelize.sync(); // synchronize with existing tables
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.log("Error connecting: ", err);
  });

app.use("/api", api);
app.use("/Images", express.static("./Images"));
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send(error);
});

app.all("*", (req, res) => {
  res.status(404).send(`Can't find ${req.originalUrl} on this server!`);
});
app.listen(PORT, HOST, (err) => {
  if (err) {
    console.error("Problem starting the server!");
    throw err;
  }
  console.log(`Server running on http://${HOST}:${PORT}`);
});
