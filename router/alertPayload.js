require("dotenv").config();
const axios = require("axios")

exports.sendAlertPayload = async (req,res)=>{
    console.log(req.body)
    console.log("EVAL MATCH",req.body.evalMatches)
    let self = this;
    try {
        metricValue =  parseFloat(req.body.evalMatches[0].value)
        alertThreshold = parseFloat(req.body.tags.alertThreshold)
        ScaleDownThreshold = parseFloat(req.body.tags.ScaleDownThreshold)
        if (alertThreshold != -1 && metricValue > alertThreshold ) {
            scale = "ScaleUP"
        } else if (ScaleDownThreshold != -1 && metricValue < ScaleDownThreshold) {
            scale = "ScaleDown"
        } else {
            scale = "NoAction"
        }
        
    } catch (e) {
        console.log("error to provide solution")
        scale = "Error"
    }
    try {
        cb_url = req.body.tags.callback_url
        alertType = req.body.tags.type
        // scale = req.body.tags.scale
        jobID = req.body.tags.jobID
    } catch (e) {
        res.send('Please Provide Callback URL')
    }
    axios.post(cb_url,{alertType: alertType,jobID: jobID,scale: scale}).then((response)=>{
        res.send("done!")
    })

}