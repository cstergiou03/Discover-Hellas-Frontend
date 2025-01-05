import React from 'react';
import "../StyleProvider/userProfilePanel.css"
import ProviderProfile from './ProviderProfile'; // το component του User Profile
import ProviderSidebar from './ProviderSidebar'; // το component του Sidebar

function UserProfilePanel() {
  return (
    <div className="user-profile-panel">
      <ProviderSidebar />
      <div className="profile-content">
        <ProviderProfile />
      </div>
    </div>
  );
}

export default UserProfilePanel;
