import CommonToolbar from "@/components/common/common-toolbar.component"
import SidebarNav from "@/components/common/sidebar-nav.component"
import { ScanComponent } from "@/components/settings/scan/scan.component"

const Scan = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNav />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <CommonToolbar />
        
        {/* Photo gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          <ScanComponent />
        </div>
      </div>
    </div>
  )
}

export default Scan