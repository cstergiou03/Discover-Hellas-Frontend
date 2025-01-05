import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import "../StyleAdmin/eventView.css"
import EventFormAdmin from "./EventFormAdmin";

function EventView(){

    return(
        <div className="event-view-container">
            <AdminSidebar/>
            <EventFormAdmin/>
            <ProfileSidebarAdmin/>
        </div>
    );
}   

export default EventView;