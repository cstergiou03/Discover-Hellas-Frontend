import "../StyleProvider/createEventPanel.css";
import ProfileSidebar from "./ProfileSidebar";
import ProviderSidebar from "./ProviderSidebar";
import EventEdit from "./EventEdit";
import { useState, useEffect } from "react";

function EditEventPanel() {
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
            <EventEdit />
            {!isSmallScreen && <ProfileSidebar />}
        </div>
    )
}

export default EditEventPanel;