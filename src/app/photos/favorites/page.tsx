
'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import SidebarNav from '@/components/photos/sidebar-nav.component';
import PhotosToolbar from '@/components/photos/photos-toolbar.component';
import PhotoGallery from '@/components/photos/photo-gallery.component';
import { PhotosRequest } from '@/types/photo.type';

const FavoritesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations();
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Filters for favorites
  const filters: Partial<PhotosRequest> = {
    title: searchQuery || undefined,
    liked: true, // Only show liked photos
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNav />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <PhotosToolbar onSearch={handleSearch} />
        
        {/* Photo gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">{t('photos.favorites')}</h1>
          <PhotoGallery initialFilters={filters} />
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;