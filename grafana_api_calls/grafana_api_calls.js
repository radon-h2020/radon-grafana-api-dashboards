
require("dotenv").config();
const axios = require("axios")
const {build_json_docker} = require("../dashboardTemplates/cadvisor_dashboard")
const {build_json_awsLambda} = require("../dashboardTemplates/lambda_dashboard")
const {build_json_ptw} = require("../dashboardTemplates/push_gwt_dashboard")
const headers = {
'Authorization': `Bearer ${process.env.GRAFANA_API_KEY}` 
}
const grafana_url = process.env.GRAFANA_URL

exports.create_data_source_aws = async (userID,jobid,keys) => {
  const {accessKey,secretKey} = keys
  const datasource_json = 
  {
    "name": `${jobid}`,
    "type": "cloudwatch",
    "url": "http://monitoring.us-west-1.amazonaws.com",
    "access": "proxy",
    "jsonData": {
      "authType": "keys",
      "defaultRegion": "eu-central-1"
    },
    "secureJsonData": {
      "accessKey": `${accessKey}`,
      "secretKey": `${secretKey}`
    }
  }

  const permData = {
    "userId": userID,
    "permission": 1
  }
try {
  let datasoureRes = await axios.post(`${grafana_url}/api/datasources`,datasource_json,{headers:headers})
  // set permissions of Datasource to user only
  let enablePermisions = await axios.post(`${grafana_url}/api/datasources/${datasoureRes.data.datasource.id}/enable-permissions`,{},{headers:headers})
  let setPermissions = await axios.post(`${grafana_url}/api/datasources/${datasoureRes.data.datasource.id}/permissions`,permData,{headers:headers})
  console.log("DS:",datasoureRes.data.datasource.id)
  return datasoureRes.data
} catch (e) {
  return e
}

}

exports.get_user_details = async (mail) => {
    let results = await axios.get(`${grafana_url}/api/users/lookup?loginOrEmail=${mail}`, {
        auth: {
          username: process.env.GRAFANA_ADMIN_USERNAME,
          password: process.env.GRAFANA_ADMIN_PASSWORD
        }
      })
      let data = results.data
      return data
}

exports.create_folder = async(jobID)=>{
    let results = await axios.post(`${grafana_url}/api/folders`,   
    {title: jobID},
    {    
        headers: headers
    }
    )
    let data = results.data
    return data
}

exports.change_permissions_folder = async(userId,folderuuid) => {
    let data = {
        "items": [
          {
            "userId": userId,
            "permission": 1 // 1 is viewer
          }
        ]
      }
    let results = await axios.post(`${grafana_url}/api/folders/${folderuuid}/permissions`,data,{headers:headers})
    return results.data
}

exports.buildDashboard = async(folderid,jobID,Dtype) => {
    // const json_dashboard = dashboard.build_json(jobID)
    let json_dashboard

    if (Dtype === "docker") {
      json_dashboard = build_json_docker(jobID)
    } else if (Dtype ==="awsLambda") {
      json_dashboard = build_json_awsLambda(jobID)
    } else if (Dtype === "custom") {
      json_dashboard = build_json_ptw(jobID)
    }
    else {
        return "Please add type"
    }
    
    let data = {
        "dashboard": {
            "id": null,
            "uid": null,
            "title": "Production Overview",
            "tags": [ "templated" ],
            "timezone": "browser",
            "schemaVersion": 16,
            "version": 0,
            "refresh": "25s",
            ...json_dashboard
          },
          "folderId": folderid,
          "overwrite": true
    }
    let results = await axios.post(`${grafana_url}/api/dashboards/db`,data,{headers:headers})


    return results.data
}

exports.delete_folder = async(folderuuid) => {
  let results = await axios.delete(`${grafana_url}/api/folders/${folderuuid}`,{headers:headers})
                .catch((e)=>console.log(e.response))
  return results
}

exports.delete_datasource = async(datasourceName) => {
  let results = await axios.delete(`${grafana_url}/api/datasources/name/${datasourceName}`,{headers:headers})
                      .catch((e)=>{
                        console.log(e.response.data)
                        return -1
                      })
  return results
}

exports.get_folder_by_title = async(title) => {
  let res = await axios.get(`${grafana_url}/api/folders`,{headers})
  let folder = {};
  const {data} = res
  if (data.length > 0) {
    for (let i=0; i< data.length; i++) {
      

      if(data[i].title == title){
        folder = data[i]
        break;
      }
    }
  }

  return folder
}

exports.get_datasource_by_title = async(name) => {
  let res = await axios.get(`${grafana_url}/api/datasources`,{headers})
  let datasources = {};
  const {data} = res
  if (data.length > 0) {
    for (let i=0; i< data.length; i++) {
      

      if(data[i].name == name){
        datasources = data[i]
        break;
      }
    }
  }

  return datasources
}

exports.get_folder_permissions = async(folderuid) => {
  let folderPermissions = await axios.get(`${grafana_url}/api/folders/${folderuid}/permissions`,{headers})                          
  const {data} = folderPermissions
  return data
}

