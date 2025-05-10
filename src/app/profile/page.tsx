import SidebarNav from '@/components/common/sidebar-nav.component';
import ProfilePage from '@/components/profile/profile-page.component';
import ProfileToolbar from '@/components/profile/profile-toolbar.component';

const Profile = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNav />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <ProfileToolbar />
        
        {/* Photo gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          <ProfilePage />
        </div>
      </div>
    </div>
  );
};

export default Profile;