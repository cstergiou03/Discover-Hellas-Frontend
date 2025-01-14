import "../StyleProvider/createAmenityPanel.css";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import AmenityForm from "../ProviderComponents/AmenityForm";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";

function CreateAmenityAdminPanel(){
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
        <div className="create-amenity-container">
            <AdminSidebar/>
            <AmenityForm/>
            {!isSmallScreen && <ProfileSidebarAdmin />}
        </div>
    )
}

export default CreateAmenityAdminPanel;