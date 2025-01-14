import "../StyleAdmin/adminMainPanel.css"
import AdminSidebar from "./AdminSidebar"
import AdminStatistics from "./AdminStatistics";
import ProfileSidebar from "./ProfileSidebarAdmin"
import { useState, useEffect } from "react";

function AdminMainPanel(){
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 950);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 950);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return(
        <div className="admin-main-panel">
            <AdminSidebar/>
            <AdminStatistics/>
            {!isSmallScreen && <ProfileSidebar />}
        </div>
    )
}

export default AdminMainPanel;