import CommonToolbar from "@/components/common/common-toolbar.component";
import SidebarNav from "@/components/common/sidebar-nav.component";
import AddSharedUser from "@/components/share/add-shared-user.component";

export default function AddPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNav />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <CommonToolbar />
        
        <div className="flex-1 overflow-y-auto p-6">
          <AddSharedUser />
        </div>
      </div>
    </div>
  );
}
