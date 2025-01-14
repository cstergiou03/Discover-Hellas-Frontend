import "../StyleProvider/createAmenityPanel.css";
import ProfileSidebar from "./ProfileSidebar";
import ProviderSidebar from "./ProviderSidebar";
import AmenityForm from "./AmenityForm";
import { useState, useEffect } from "react";

function CreateAmenityPanel() {
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

    return (
        <div className="create-amenity-container">
            <ProviderSidebar />
            <AmenityForm />
            {!isSmallScreen && <ProfileSidebar />}
        </div>
    )
}

export default CreateAmenityPanel;