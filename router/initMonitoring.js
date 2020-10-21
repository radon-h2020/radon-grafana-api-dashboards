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

    if (req.body.type === "docker") {
        let response = await createCadvisorDashboard(req.body.email,req.body.jobid,req.body.type)
        if (response == 0) {
            res.send("Dashboard created!")
        } else {
            res.status(400).send(response)
        }
    } else if (req.body.type === "awsLambda") {
        let response = await createCloudwatchDashboard(req.body.email,req.body.jobid,req.body.keys,req.body.type)
        if (response == 0) {
            res.send("Dashboard created!")
        } else {
            res.status(400).send(response)
        }
        
    } else if (req.body.type === "custom"){
        let response = await createCustomDashboard(req.body.email,req.body.jobid,req.body.type)
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

