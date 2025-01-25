import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import ProviderApprovalForm from "./ProviderApprovalForm";
import "../StyleAdmin/amenityView.css"
import { useState, useEffect } from "react";

function ProviderApproval(){
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
        <div className="amenity-view-container">
            <AdminSidebar/>
            <ProviderApprovalForm/>
            {!isSmallScreen && <ProfileSidebarAdmin />}
        </div>
    );
}

export default ProviderApproval;