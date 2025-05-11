'use client'

import React from 'react';
import ShareManagement from '@/components/share/share-management.component';
import { SharedUserRequest } from '@/types/shared-user.type';
import SidebarNav from '@/components/common/sidebar-nav.component';
import CommonToolbar from '@/components/common/common-toolbar.component';

export default function SharedUsersPage() {
  // Initial filters can be empty or set based on query params
  const initialFilters: Partial<SharedUserRequest> = {};

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
          <ShareManagement initialFilters={initialFilters} />
        </div>
      </div>
    </div>
  );
}