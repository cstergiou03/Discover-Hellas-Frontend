import React from 'react';
import "../StyleProvider/userProfilePanel.css"
import ProviderProfile from './ProviderProfile';
import ProviderSidebar from './ProviderSidebar';

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
