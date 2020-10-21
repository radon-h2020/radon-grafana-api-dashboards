const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const {initMonitoring} = require("./router/initMonitoring")
const {deleteMonitoring} = require("./router/deleteMonitoring")
require("dotenv").config();

const port = process.env.PORT || 3100;
const app = express();
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
app.post("/",initMonitoring)
app.delete("/",deleteMonitoring)

app.listen(port);
console.log("App running at port: ", port)