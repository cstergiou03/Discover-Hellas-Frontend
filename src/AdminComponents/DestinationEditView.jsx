import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import "../StyleAdmin/amenityView.css"
import EditDestination from "./EditDestination";

function DestinationEditView(){

    return(
        <div className="amenity-view-container">
            <AdminSidebar/>
            <EditDestination/>
            <ProfileSidebarAdmin/>
        </div>
    );
}   

export default DestinationEditView;