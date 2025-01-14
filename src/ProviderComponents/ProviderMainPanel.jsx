import "../StyleProvider/providerMainPanel.css";
import { useState, useEffect } from "react";
import ProviderSidebar from "./ProviderSidebar";
import ProfileSidebar from "./ProfileSidebar";
import ProviderStatistics from "./ProviderStatistics";

function ProviderMainPanel() {
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
        <div className="provider-main-panel">
            <ProviderSidebar />
            <ProviderStatistics />
            {!isSmallScreen && <ProfileSidebar />}
        </div>
    );
}

export default ProviderMainPanel;
