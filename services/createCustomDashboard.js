const {get_user_details,create_folder,delete_folder,change_permissions_folder,buildDashboard} = require("../grafana_api_calls/grafana_api_calls")

exports.createCustomDashboard = async (mail,jobid,dtype,cpuThreshold,ramThreshold,payloadURL,cpuDownScaleThreshold,ramDownScaleThreshold) =>{
    let user,folderData,cDash,results
    try {
        user = await get_user_details(mail)
        folderData = await create_folder(jobid)
        console.log("folder Created",folderData)
        status_permission = await change_permissions_folder(user.id,folderData.uid)
        console.log("folderData",folderData)

        cDash = await buildDashboard(folderData.id,jobid,dtype,cpuThreshold,ramThreshold,payloadURL,cpuDownScaleThreshold,ramDownScaleThreshold)

        return 0

    } catch (e) {
        // Delete folder if created so user can retry again.
        if (folderData){
            results =  await delete_folder(folderData.uid)
        }
        return e.response.data.message
    }
}