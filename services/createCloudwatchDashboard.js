const {get_user_details,create_folder,change_permissions_folder,delete_folder,delete_datasource,buildDashboard,create_data_source_aws} = require("../grafana_api_calls/grafana_api_calls")

exports.createCloudwatchDashboard = async (mail,jobid,keys,dtype) => {
    let user,folderData,cDash,datasource

    try {
        user = await get_user_details(mail).catch(e=>{return -1})
        console.log(user.id)
        datasource = await create_data_source_aws(user.id,jobid,keys).catch((e)=>{
            return e.response.data.message}
            )
        console.log(datasource)
        
        folderData = await create_folder(jobid).catch((e)=>{console.log(e.response.data.message)})
        status_permission = await change_permissions_folder(user.id,folderData.uid)

        console.log(folderData)
        cDash = await buildDashboard(folderData.id,jobid,dtype).catch((e)=>{console.log(e.response.data.message)})
        return 0;
   
    } catch (e) {
        if (user == -1) {
            return "User not found"
        }
        if (datasource){
           await delete_datasource(datasource.name)
        }
        if (folderData){
           await delete_folder(folderData.uid)
        }
        return e
    }
}