'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SidebarNav from '@/components/photos/sidebar-nav.component';
import PhotosToolbar from '@/components/photos/photos-toolbar.component';
import PhotoGallery from '@/components/photos/photo-gallery.component';
import { Photo, PhotosRequest } from '@/types/photo.type';
import { photoApi } from '@/lib/api/photo.api';
import { logError } from '@/lib/utils/error.util';

const PhotosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();
  
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handlePhotoSelect = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
    // You could also navigate to a detail page
    // router.push(`/photos/${photo.id}`);
  }, []);
  
  // Prepare filters based on the current view
  const filters: Partial<PhotosRequest> = {
    title: searchQuery || undefined,
    // Add skip and take to make it a valid PhotosRequest
    skip: 0, 
    take: 24
  };
  
  // Check API connectivity when component mounts
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        // Simple API test - just get one photo to check connectivity
        await photoApi.getPhotoList({ skip: 0, take: 1 });
        setError(null);
      } catch (err) {
        logError(err);
        setError(t('common.apiError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    checkApiConnection();
  }, [t]);
  
  // Close photo detail view
  const handleCloseDetail = () => {
    setSelectedPhoto(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <p className="text-gray-600 mb-6">{t('common.tryAgainLater')}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {t('common.refresh')}
          </button>
        </div>
      </div>
    );
  }
  
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
          <PhotoGallery 
            initialFilters={filters}
            onPhotoSelect={handlePhotoSelect}
          />
        </div>
      </div>
      
      {/* Photo detail modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{selectedPhoto.title}</h3>
              <button 
                onClick={handleCloseDetail}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Photo detail view */}
              <div className="flex flex-col space-y-4">
                {/* Photo image */}
                <div className="relative aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
                  {selectedPhoto.files && selectedPhoto.files.length > 0 && (
                    <img 
                      src={`/api/v1/photo/view/${selectedPhoto.files[0].id}`}
                      alt={selectedPhoto.title}
                      className="object-contain w-full h-full"
                    />
                  )}
                </div>
                
                {/* Photo metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedPhoto.cameraMake && (
                    <div>
                      <span className="font-medium">{t('photos.camera')}:</span> {selectedPhoto.cameraMake} {selectedPhoto.cameraModel}
                    </div>
                  )}
                  {selectedPhoto.lensMake && (
                    <div>
                      <span className="font-medium">{t('photos.lens')}:</span> {selectedPhoto.lensMake} {selectedPhoto.lensModel}
                    </div>
                  )}
                  {selectedPhoto.focalLength && (
                    <div>
                      <span className="font-medium">{t('photos.focalLength')}:</span> {selectedPhoto.focalLength}mm
                    </div>
                  )}
                  {selectedPhoto.fNumber && (
                    <div>
                      <span className="font-medium">{t('photos.aperture')}:</span> f/{selectedPhoto.fNumber}
                    </div>
                  )}
                  {selectedPhoto.exposureTime && (
                    <div>
                      <span className="font-medium">{t('photos.shutterSpeed')}:</span> {selectedPhoto.exposureTimeValue || `${selectedPhoto.exposureTime}s`}
                    </div>
                  )}
                  {selectedPhoto.iso && (
                    <div>
                      <span className="font-medium">{t('photos.iso')}:</span> {selectedPhoto.iso}
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags.map(tag => (
                      <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosPage;