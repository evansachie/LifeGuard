import React, { forwardRef } from 'react';

const ProfileMenu = forwardRef(({ onMenuItemClick }, ref) => (
  <div ref={ref} className="profile-menu">
    <button 
      className="profile-menu-item" 
      onMouseDown={() => onMenuItemClick('/profile')}>
      Profile
    </button>
    <button 
      className="profile-menu-item" 
      onMouseDown={() => onMenuItemClick('/settings')}>
      Settings
    </button>
    <button 
      className="profile-menu-item logout" 
      onMouseDown={() => onMenuItemClick('logout')}>
      Log Out
    </button>
  </div>
));

ProfileMenu.displayName = 'ProfileMenu';

export default ProfileMenu;
