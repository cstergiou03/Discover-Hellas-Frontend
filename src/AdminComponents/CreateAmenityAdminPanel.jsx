import "../StyleProvider/createAmenityPanel.css";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import AmenityForm from "../ProviderComponents/AmenityForm";
import AdminSidebar from "./AdminSidebar";

function CreateAmenityAdminPanel(){

    return(
        <div className="create-amenity-container">
            <AdminSidebar/>
            <AmenityForm/>
            <ProfileSidebarAdmin/>
        </div>
    )
}

export default CreateAmenityAdminPanel;