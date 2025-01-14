import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import "../StyleAdmin/eventView.css"
import EventFormAdmin from "./EventFormAdmin";
import { useState, useEffect } from "react";

function EventView() {
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
        <div className="event-view-container">
            <AdminSidebar />
            <EventFormAdmin />
            {!isSmallScreen && <ProfileSidebarAdmin />}
        </div>
    );
}

export default EventView;