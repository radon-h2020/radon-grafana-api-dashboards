
const {deleteDashboards} = require("../services/deleteDashboard")

require("dotenv").config();

const headers = {
    'Authorization': `Bearer ${process.env.GRAFANA_API_KEY}` 
    }


exports.deleteMonitoring = async (req,res) => {
    if ( !req.body.email || !req.body.jobid) {
        res.status(400).send("Please provide user email and jobID")
        return
    }
    let deleteMonitor = await deleteDashboards(req.body.email,req.body.jobid)
    if (deleteMonitor == 0) {
        res.send("Dashboard deleted!")
    } else {
        res.status(400).send(deleteMonitor)
    }

}