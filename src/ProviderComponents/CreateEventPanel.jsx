import "../StyleProvider/createEventPanel.css";
import ProfileSidebar from "./ProfileSidebar";
import ProviderSidebar from "./ProviderSidebar";
import EventForm from "./EventForm";

function CreateEventPanel() {
    return (
        <div className="create-event-container">
            <ProviderSidebar />
            <EventForm />
            <ProfileSidebar />
        </div>
    );
}

export default CreateEventPanel;
