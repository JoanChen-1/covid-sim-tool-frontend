// load env var
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 8888;
const path = require('path');
const compression = require('compression');

// allowing CORS
const cors = require("cors");
app.use(cors());

// parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logger
app.use(morgan("dev"));

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "build")));

// distribution router
const distributionRouter = require("./controllers/distribution-router");
app.use("/covid-sim-tool", distributionRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
})