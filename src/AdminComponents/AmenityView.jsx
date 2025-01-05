import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import AmenityFormAdmin from "./AmenityFormAdmin"
import "../StyleAdmin/amenityView.css"

function AmenityView(){

    return(
        <div className="amenity-view-container">
            <AdminSidebar/>
            <AmenityFormAdmin/>
            <ProfileSidebarAdmin/>
        </div>
    );
}   

export default AmenityView;