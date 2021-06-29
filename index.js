const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const {initMonitoring} = require("./router/initMonitoring")
const {deleteMonitoring} = require("./router/deleteMonitoring")
const {get_notifications_uid} = require("./grafana_api_calls/grafana_api_calls")
const {initAlerting} = require("./router/addAlerting")
const {sendAlertPayload} = require("./router/alertPayload")
require("dotenv").config();

const init = async () => {
    const data = await get_notifications_uid()
    console.log(process.env.NOTIFICATION_ID)
    // GET NOTIFICATION CHANNEL ID
    
    
    const port = process.env.PORT || 3100;
    const app = express();
    app.use(cors());
    app.use(morgan("combined"));
    app.use(bodyParser.json({ type: "*/*" }));
    app.post("/",initMonitoring)
    app.delete("/",deleteMonitoring)
    app.post("/alert",initAlerting)
    app.post("/sendAlertPayload",sendAlertPayload)
    app.listen(port);
    console.log("App running at port: ", port)
}

init()
