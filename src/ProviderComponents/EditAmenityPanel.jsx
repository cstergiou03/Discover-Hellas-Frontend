import "../StyleProvider/createAmenityPanel.css";
import ProfileSidebar from "./ProfileSidebar";
import ProviderSidebar from "./ProviderSidebar";
import AmenityEdit from "./AmenityEdit";
import { useState, useEffect } from "react";

function EditAmenityPanel(){

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
            <ProviderSidebar/>
            <AmenityEdit/>
            {!isSmallScreen && <ProfileSidebar />}
        </div>
    )
}

export default EditAmenityPanel;