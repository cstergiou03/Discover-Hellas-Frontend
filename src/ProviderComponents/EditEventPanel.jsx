import "../StyleProvider/createEventPanel.css";
import ProfileSidebar from "./ProfileSidebar";
import ProviderSidebar from "./ProviderSidebar";
import EventEdit from "./EventEdit";

function EditEventPanel(){

    return(
        <div className="create-amenity-container">
            <ProviderSidebar/>
            <EventEdit/>
            <ProfileSidebar/>
        </div>
    )
}

export default EditEventPanel;