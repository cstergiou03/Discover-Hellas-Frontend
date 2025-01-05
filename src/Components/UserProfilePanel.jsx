import Header from "./Header";
import UserProfile from "./UserProfile";
import "../Style/userProfilePanel.css"

function UserProfilePanel(){

    return(
        <div>
            <div className="profile-header-container">
                <Header/>
            </div>
            <div>
                <UserProfile/>
            </div>
        </div>
    );
}

export default UserProfilePanel;