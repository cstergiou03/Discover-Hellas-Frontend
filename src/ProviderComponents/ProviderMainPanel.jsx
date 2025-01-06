import "../StyleProvider/providerMainPanel.css";
import ProviderSidebar from "./ProviderSidebar";
import ProfileSidebar from "./ProfileSidebar";
import ProviderStatistics from "./ProviderStatistics";

function ProviderMainPanel(){

    return(
        <div className="provider-main-panel">
            <ProviderSidebar/>
            <ProviderStatistics/>
            {/* <ProfileSidebar/> */}
        </div>
    )
}

export default ProviderMainPanel;