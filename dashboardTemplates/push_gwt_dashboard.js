require("dotenv").config();
const {buildAlertCpu} = require("./alerts/alertCpu")
const {buildAlertRam} = require("./alerts/alertRam")
const convertToByte = 1048576
const prom_ds_name = process.env.PROM_DS_NAME

exports.build_json_ptw = (jobID,cpuThreshold,ramThreshold,payloadURL,cpuDownScaleThreshold,ramDownScaleThreshold) => {
    const ram = jobID +"_ram"
    const cpu = jobID +"_cpu"
    console.log("CPUALERT",cpuThreshold)
    console.log("RAMALERT",ramThreshold)
    console.log("CPU_DownScale",cpuDownScaleThreshold)
    console.log("RamDownScale",ramDownScaleThreshold)
    console.log("Payload URL",payloadURL)
  
    //alertCPU = (cpuThreshold ? buildAlertCpu(cpuThreshold,jobID,payloadURL) : {})
    alertCPU = (cpuThreshold && cpuDownScaleThreshold ? buildAlertCpu(cpuThreshold,cpuDownScaleThreshold,jobID,payloadURL) : cpuThreshold ? buildAlertCpu(cpuThreshold,null,jobID,payloadURL) : cpuDownScaleThreshold ? buildAlertCpu(null,cpuDownScaleThreshold,jobID,payloadURL) : {})
    //    alertRAM = (ramThreshold ? buildAlertRam(ramThreshold * convertToByte,jobID,payloadURL) : {})
    alertRAM = (ramThreshold && ramDownScaleThreshold ? buildAlertRam(ramThreshold * convertToByte,ramDownScaleThreshold * convertToByte,jobID,payloadURL) : {})

    const dashboard_json = {
        "__inputs": [
          {
            "name": `${prom_ds_name}`,
            "label": "prometheus_data_source",
            "description": "",
            "type": "datasource",
            "pluginId": "prometheus",
            "pluginName": "Prometheus"
          }
        ],
        "__requires": [
          {
            "type": "grafana",
            "id": "grafana",
            "name": "Grafana",
            "version": "7.1.5"
          },
          {
            "type": "panel",
            "id": "graph",
            "name": "Graph",
            "version": ""
          },
          {
            "type": "datasource",
            "id": "prometheus",
            "name": "Prometheus",
            "version": "1.0.0"
          }
        ],
        "annotations": {
          "list": [
            {
              "builtIn": 1,
              "datasource": "-- Grafana --",
              "enable": true,
              "hide": true,
              "iconColor": "rgba(0, 211, 255, 1)",
              "name": "Annotations & Alerts",
              "type": "dashboard"
            }
          ]
        },
        "editable": true,
        "gnetId": null,
        "graphTooltip": 0,
        "id": null,
        "links": [],
        "panels": [
          { ...alertRAM,
            "aliasColors": {},
            "bars": false,
            "dashLength": 10,
            "dashes": false,
            "datasource": `${prom_ds_name}`,
            "fieldConfig": {
              "defaults": {
                "custom": {},
                "links": []
              },
              "overrides": []
            },
            "fill": 1,
            "fillGradient": 0,
            "gridPos": {
              "h": 8,
              "w": 12,
              "x": 0,
              "y": 0
            },
            "hiddenSeries": false,
            "id": 6,
            "legend": {
              "avg": false,
              "current": false,
              "max": false,
              "min": false,
              "show": true,
              "total": false,
              "values": false
            },
            "lines": true,
            "linewidth": 1,
            "nullPointMode": "null",
            "percentage": false,
            "pluginVersion": "7.1.5",
            "pointradius": 2,
            "points": false,
            "renderer": "flot",
            "seriesOverrides": [],
            "spaceLength": 10,
            "stack": false,
            "steppedLine": false,
            "targets": [
              {
                "expr": `memory_usage_bytes{job=\"${ram}\"}`,
                "interval": "",
                "legendFormat": "{{name}}",
                "refId": "A"
              }
            ],
            "thresholds": [],
            "timeFrom": null,
            "timeRegions": [],
            "timeShift": null,
            "title": "RAM",
            "tooltip": {
              "shared": true,
              "sort": 0,
              "value_type": "individual"
            },
            "type": "graph",
            "xaxis": {
              "buckets": null,
              "mode": "time",
              "name": null,
              "show": true,
              "values": []
            },
            "yaxes": [
              {
                "format": "decbytes",
                "label": null,
                "logBase": 1,
                "max": null,
                "min": null,
                "show": true
              },
              {
                "format": "short",
                "label": null,
                "logBase": 1,
                "max": null,
                "min": null,
                "show": true
              }
            ],
            "yaxis": {
              "align": false,
              "alignLevel": null
            }
          },
          {
            ...alertCPU,
            "aliasColors": {},
            "bars": false,
            "dashLength": 10,
            "dashes": false,
            "datasource": `${prom_ds_name}`,
            "fieldConfig": {
              "defaults": {
                "custom": {}
              },
              "overrides": []
            },
            "fill": 1,
            "fillGradient": 0,
            "gridPos": {
              "h": 9,
              "w": 12,
              "x": 12,
              "y": 0
            },
            "hiddenSeries": false,
            "id": 2,
            "legend": {
              "avg": false,
              "current": false,
              "max": false,
              "min": false,
              "show": true,
              "total": false,
              "values": false
            },
            "lines": true,
            "linewidth": 1,
            "nullPointMode": "null",
            "percentage": false,
            "pluginVersion": "7.1.5",
            "pointradius": 2,
            "points": false,
            "renderer": "flot",
            "seriesOverrides": [],
            "spaceLength": 10,
            "stack": false,
            "steppedLine": false,
            "targets": [
              {
                "expr": `rate(cpu_usage_percent{job=\"${cpu}\"}[30s])`,
                "interval": "",
                "legendFormat": "",
                "refId": "A"
              }
            ],
            "thresholds": [],
            "timeFrom": null,
            "timeRegions": [],
            "timeShift": null,
            "title": "cpu usage",
            "tooltip": {
              "shared": true,
              "sort": 0,
              "value_type": "individual"
            },
            "type": "graph",
            "xaxis": {
              "buckets": null,
              "mode": "time",
              "name": null,
              "show": true,
              "values": []
            },
            "yaxes": [
              {
                "format": "short",
                "label": null,
                "logBase": 1,
                "max": null,
                "min": null,
                "show": true
              },
              {
                "format": "short",
                "label": null,
                "logBase": 1,
                "max": null,
                "min": null,
                "show": true
              }
            ],
            "yaxis": {
              "align": false,
              "alignLevel": null
            }
          }
        ],
        "refresh": false,
        "schemaVersion": 26,
        "style": "dark",
        "tags": [],
        "templating": {
          "list": [{
            "hide": 0,
            "label": "datasource",
            "name": "DS_PROMETHEUS",
            "options": [],
            "query": "prometheus",
            "refresh": 1,
            "regex": "",
            "type": "datasource"
          }]
        },
        "time": {
          "from": "now-3h",
          "to": "now"
        },
        "timepicker": {
          "refresh_intervals": [
            "5s",
            "10s",
            "30s",
            "1m",
            "5m",
            "15m",
            "30m",
            "1h",
            "2h",
            "1d"
          ]
        },
        "timezone": "",
        "title": "PushGateWay",
        "uid": `${jobID}`,
        // "version": 2
      }

      return dashboard_json


}