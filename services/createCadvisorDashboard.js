const {get_user_details,create_folder,delete_folder,delete_datasource,change_permissions_folder,buildDashboard,create_data_source_aws} = require("../grafana_api_calls/grafana_api_calls")

exports.createCadvisorDashboard = async (mail,jobid,dtype,cpuThreshold,ramThreshold,cpuDownScaleThreshold,ramDownScaleThreshold) =>{
    let user,folderData,status_permission,cDash,results

    try {

        user = await get_user_details(mail)
        // console.log("AFTER GET USER",user)

        folderData = await create_folder(jobid)
        status_permission = await change_permissions_folder(user.id,folderData.uid)
        // console.log("folderData",folderData)
        cDash = await buildDashboard(folderData.id,jobid,dtype,cpuThreshold,ramThreshold,cpuDownScaleThreshold,ramDownScaleThreshold)
        console.log("CDASH",cDash)
        return 0;

    } catch (e) {
        // Delete folder if created so user can retry again.
        if (folderData){
            results =  await delete_folder(folderData.uid)
        }
        return e.response.data.message
    }
}