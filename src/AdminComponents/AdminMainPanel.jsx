import "../StyleAdmin/adminMainPanel.css"
import AdminSidebar from "./AdminSidebar"
import AdminStatistics from "./AdminStatistics";
import ProfileSidebar from "./ProfileSidebarAdmin"

function AdminMainPanel(){

    return(
        <div className="admin-main-panel">
            <AdminSidebar/>
            <AdminStatistics/>
            <ProfileSidebar/>
        </div>
    )
}

export default AdminMainPanel;