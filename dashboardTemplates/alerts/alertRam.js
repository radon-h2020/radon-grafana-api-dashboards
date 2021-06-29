require("dotenv").config();
exports.buildAlertRam = (threshold=null,scaleDownThresshold=null,jobID,payloadURL=null) => {
    let conditions = []
    if (threshold) {
        let alertEval = {
            "evaluator": {
            "params": [
                threshold
            ],
            "type": "gt"
            },
            "operator": {
            "type": "and"
            },
            "query": {
            "params": [
                "A",
                "5m",
                "now"
            ]
            },
            "reducer": {
            "params": [],
            "type": "avg"
            },
            "type": "query"
        }
        conditions.push(alertEval)
    }

    if (scaleDownThresshold) {
        let ScaleDownEval = {
            "evaluator": {
            "params": [
                scaleDownThresshold
            ],
            "type": "lt"
            },
            "operator": {
            "type": "or"
            },
            "query": {
            "params": [
                "A",
                "5m",
                "now"
            ]
            },
            "reducer": {
            "params": [],
            "type": "avg"
            },
            "type": "query"
        }
        conditions.push(ScaleDownEval)

    }
   
   
   
    const alertItem = {
        "alert": {
            "alertRuleTags": {
                "jobID":jobID,
                "type": "RAM",
                "callback_url": payloadURL,
                "scale": 1,
                "alertThreshold": threshold ? threshold.toString() : "-1",
                "ScaleDownThreshold": scaleDownThresshold ? scaleDownThresshold.toString() : "-1"
            },
            "conditions": conditions,
            "executionErrorState": "alerting",
            "for": "5m",
            "frequency": "1m",
            "handler": 1,
            "name": "RAM Usage",
            "noDataState": "ok",
            "executionErrorState": "keep_state", //Remove if fails
            "notifications": [
                {
                    "uid": process.env.NOTIFICATION_ID
                }
            ],
            

        }
    }

    return alertItem
}