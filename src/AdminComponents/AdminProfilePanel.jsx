import AdminSidebar from "./AdminSidebar";
import AdminProfile from "./AdminProfile";
import "../StyleAdmin/adminProfilePanel.css";

function AdminProfilePanel() {
    return (
        <div className="admin-profile-panel">
            <AdminSidebar />
            <div className="admin-profile-scroll">
                <AdminProfile />
            </div>
        </div>
    );
}

export default AdminProfilePanel;
