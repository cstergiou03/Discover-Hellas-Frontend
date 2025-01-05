import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import "../StyleAdmin/amenityView.css"
import DestinationForm from "./DestinationForm";

function DestinationView(){

    return(
        <div className="amenity-view-container">
            <AdminSidebar/>
            <DestinationForm/>
            <ProfileSidebarAdmin/>
        </div>
    );
}   

export default DestinationView;