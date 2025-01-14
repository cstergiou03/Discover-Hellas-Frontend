import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import "../StyleAdmin/amenityView.css"
import DestinationForm from "./DestinationForm";
import { useState, useEffect } from "react";

function DestinationView(){
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
            <DestinationForm/>
            {!isSmallScreen && <ProfileSidebarAdmin />}
        </div>
    );
}   

export default DestinationView;