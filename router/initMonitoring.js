require("dotenv").config();
const {createCadvisorDashboard} = require('../services/createCadvisorDashboard.js')
const {createCloudwatchDashboard} = require('../services/createCloudwatchDashboard.js')
const {createCustomDashboard} = require('../services/createCustomDashboard.js')


const {get_datasource_by_title} = require('../grafana_api_calls/grafana_api_calls');

const headers = {
'Authorization': `Bearer ${process.env.GRAFANA_API_KEY}` 
}

exports.initMonitoring = async (req,res) =>{
    if ( !req.body.email || !req.body.jobid || !req.body.type) {
        res.status(500).send("Please provide user email and jobID")
        return
    }

    if (req.body.ramAlertThreshold && typeof req.body.ramAlertThreshold != "number") {
        res.status(500).send("Thresholds have to be a number")
        return
    }

    if (req.body.cpuAlertThreshold && typeof req.body.cpuAlertThreshold != "number") {
        res.status(500).send("Thresholds have to be a number")
        return
    }

    
    if (req.body.ramDownScaleThreshold && typeof req.body.ramDownScaleThreshold != "number") {
        res.status(500).send("Thresholds have to be a number")
        return
    }

    if (req.body.cpuDownScaleThreshold && typeof req.body.cpuDownScaleThreshold != "number") {
        res.status(500).send("Thresholds have to be a number")
        return
    }

    if (req.body.callbackURL && typeof req.body.callbackURL != "string") {
        res.status(500).send("URL should be string")
        // TODO 
        // ADD REGEX TO CHECK IF URL IS VALID
    }

    let cpuThreshold = (req.body.cpuAlertThreshold ? req.body.cpuAlertThreshold : null)
    let ramThreshold = (req.body.ramAlertThreshold ? req.body.ramAlertThreshold : null)

    let cpuDownScaleThreshold =  (req.body.cpuDownScaleThreshold ? req.body.cpuDownScaleThreshold : null)
    let ramDownScaleThreshold = (req.body.ramDownScaleThreshold ? req.body.ramDownScaleThreshold : null)

    let payloadURL = (req.body.callbackURL ? req.body.callbackURL : null )

    console.log("req:",req.body)


    if (req.body.type === "docker") {
        // TODO 
        // ADD CALLBACK URL FOR ALERTS
        let response = await createCadvisorDashboard(req.body.email,req.body.jobid,req.body.type,cpuThreshold,ramThreshold,cpuDownScaleThreshold,ramDownScaleThreshold)
        if (response == 0) {
            res.send("Dashboard created!")
        } else {
            res.status(400).send(response)
        }
    } else if (req.body.type === "awsLambda") {
        // TODO 
        // ADD CALLBACK URL FOR ALERTS
        let response = await createCloudwatchDashboard(req.body.email,req.body.jobid,req.body.keys,req.body.type)
        if (response == 0) {
            res.send("Dashboard created!")
        } else {
            res.status(400).send(response)
        }
        
    } else if (req.body.type === "custom"){
        let response = await createCustomDashboard(req.body.email,req.body.jobid,req.body.type,cpuThreshold,ramThreshold,payloadURL,cpuDownScaleThreshold,ramDownScaleThreshold)
        if (response == 0) {
            res.send("Dashboard created!")
        } else {
            res.status(400).send(response)
        }
    } else {
        let test = await get_datasource_by_title("ds22")
        console.log(test)
        res.status(400).send("Unsupported type")
    }
}

