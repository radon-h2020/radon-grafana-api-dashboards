const {get_user_details,delete_datasource,get_datasource_by_title,get_folder_by_title,get_folder_permissions,delete_folder} = require("../grafana_api_calls/grafana_api_calls")


exports.deleteDashboards = async(mail,jobId) => {
    let user,folder,folderPermissions
    try {
        user = await get_user_details(mail)
        console.log("user",user)
        folder = await get_folder_by_title(jobId)
        if(!Object.keys(folder).length){
            console.log("Dashboard not found")
            throw "Dashboard not found"
           }

        //check if folder belongs to user
        folderPermissions = await get_folder_permissions(folder.uid)
        if(folderPermissions === undefined || folderPermissions.length == 0){
            console.log("Couldnt get folder permissions")
            throw "Couldnt get folder permissions"
        }

        if (folderPermissions[0].userLogin != user.email){
            console.log("Dashboard does not belong to user")
            throw "Dashboard does not belong to user"
        }

        // check if there is a datasource that belongs to user
        let checkDatasouorce = await get_datasource_by_title(jobId)
        if(Object.keys(checkDatasouorce).length){
           let status = await delete_datasource(checkDatasouorce.name)
            if (status == -1){
                throw "Cannot delete Datasource"
            }
        }

        let res = await delete_folder(folder.uid)
        console.log(res.data)
        return 0

    } catch (e) {
        console.log(e)
        return e
    }
}