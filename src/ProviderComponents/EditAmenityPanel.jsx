import "../StyleProvider/createAmenityPanel.css";
import ProfileSidebar from "./ProfileSidebar";
import ProviderSidebar from "./ProviderSidebar";
import AmenityEdit from "./AmenityEdit";

function EditAmenityPanel(){

    return(
        <div className="create-amenity-container">
            <ProviderSidebar/>
            <AmenityEdit/>
            <ProfileSidebar/>
        </div>
    )
}

export default EditAmenityPanel;