import "../StyleProvider/createAmenityPanel.css";
import ProfileSidebar from "./ProfileSidebar";
import ProviderSidebar from "./ProviderSidebar";
import AmenityForm from "./AmenityForm";

function CreateAmenityPanel(){

    return(
        <div className="create-amenity-container">
            <ProviderSidebar/>
            <AmenityForm/>
            <ProfileSidebar/>
        </div>
    )
}

export default CreateAmenityPanel;