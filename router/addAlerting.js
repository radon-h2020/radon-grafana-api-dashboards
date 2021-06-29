require("dotenv").config();
const {createCadvisorDashboard} = require('../services/createCadvisorDashboard.js')
const {createCloudwatchDashboard} = require('../services/createCloudwatchDashboard.js')
const {createCustomDashboard} = require('../services/createCustomDashboard.js')

const {get_dashboard,buildDashboard} = require('../grafana_api_calls/grafana_api_calls');

const headers = {
'Authorization': `Bearer ${process.env.GRAFANA_API_KEY}` 
}

function getFolderId(theObject) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = getFolderId(theObject[i]);
            if (result) {
                break;
            }   
        }
    }
    else
    {
        for(var prop in theObject) {
            //console.log(prop + ': ' + theObject[prop]);
            if(prop == 'folderId') {
                if(theObject[prop]) {
                    return theObject[prop];
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = getFolderId(theObject[prop]);
                if (result) {
                    break;
                }
            } 
        }
    }
    return result;
}

exports.initAlerting = async(req,res) => {
    if (!req.body.jobid) {
        res.status(500).send("Please provide jobId")
    }

    if (!req.body.type) {
        res.status(500).send("Please provide type")
    }

    if (!req.body.cpuAlertThreshold && !req.body.ramAlertThreshold) {
        res.status(500).send("Please provide a Threshold")
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

    if (req.body.type === "custom") {
        console.log("Custom add allert")
        let response = await get_dashboard(req.body.jobid)
        console.log(response)
        if (response != -1) {
            try {
               const folderId = getFolderId(response)
            //    console.log(folderId,req.body.jobid,req.body.type,cpuThreshold,ramThreshold)
               if (folderId) {
                cDash = await buildDashboard(folderId,req.body.jobid,req.body.type,cpuThreshold,ramThreshold,payloadURL,cpuDownScaleThreshold,ramDownScaleThreshold)
                res.status(200).send("Alert Added!")
                // return 0;

               }
            } catch (e) {
                res.status(400).send(e)
            }
        } else {
          res.status(400).send("Dashboard Not Found!")   
        }
        // res.status(200).send(response)
    } else {
        console.log("Not implemented!")
        res.status(404).send("No exist yet!")
    }
}
