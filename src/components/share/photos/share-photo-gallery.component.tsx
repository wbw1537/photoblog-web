'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Photo, PhotosRequest } from '@/types/photo.type';
import { photoApi } from '@/lib/api/photo.api';
import PhotoCard from './share-photo-card.component';
import { useTranslations } from 'next-intl';
import { logError } from '@/lib/utils/error.util';
import { useRouter } from 'next/navigation';

interface PhotoGalleryProps {
  initialFilters?: Partial<PhotosRequest>;
  onPhotoSelect?: (photo: Photo) => void;
  sharedUserId: string;
}

const SharePhotoGallery: React.FC<PhotoGalleryProps> = ({ initialFilters, onPhotoSelect, sharedUserId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const router = useRouter();
  // Increase page size to a more reasonable number
  const PAGE_SIZE = 24;

  // Add state for column layout
  const [columns, setColumns] = useState<Photo[][]>([[], [], [], []]);
  const columnCount = useRef(4); // Default column count

  // Update column count based on screen width
  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        columnCount.current = 1;
      } else if (width < 768) {
        columnCount.current = 2;
      } else if (width < 1024) {
        columnCount.current = 3;
      } else {
        columnCount.current = 4;
      }
      distributePhotosToColumns();
    };

    window.addEventListener('resize', updateColumnCount);
    updateColumnCount();

    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Distribute photos into columns for masonry layout
  const distributePhotosToColumns = useCallback(() => {
    if (photos.length === 0) return;
    
    // Reset columns
    const newColumns: Photo[][] = Array(columnCount.current).fill(null).map(() => []);
    
    // Distribute photos to columns, trying to balance by estimated height
    photos.forEach((photo) => {
      // Find the column with the least content
      const shortestColumnIndex = newColumns
        .map((column, index) => ({
          index,
          height: column.reduce((sum, photo) => {
            // Approximate height based on aspect ratio if available
            const aspectRatio = photo.files[0].imageWidth && photo.files[0].imageHeight 
              ? photo.files[0].imageWidth / photo.files[0].imageHeight 
              : 2/3; // Default aspect ratio
            return sum + (1 / aspectRatio);
          }, 0)
        }))
        .sort((a, b) => a.height - b.height)[0].index;
      
      newColumns[shortestColumnIndex].push(photo);
    });
    
    setColumns(newColumns);
  }, [photos]);

  // Create a stable filters object that won't change between renders
  const filters = useCallback(() => {
    return {
      ...initialFilters,
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE
    };
  }, [initialFilters, page, PAGE_SIZE]);

  const fetchPhotos = useCallback(async () => {
    if (loading || !sharedUserId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching photos: page ${page}, size ${PAGE_SIZE} from shared user ID: ${sharedUserId}`);
      const currentFilters = filters();
      console.log('Filters:', currentFilters);
      
      // Use private API instead of the public one
      const response = await photoApi.privateGetPhotoList(sharedUserId);
      
      console.log(`Received ${response.data.data.length} photos`);
      
      if (page === 0) {
        setPhotos(response.data.data);
      } else {
        setPhotos(prev => [...prev, ...response.data.data]);
      }
      
      setHasMore(response.data.data.length === PAGE_SIZE);
    } catch (err) {
      logError(err);
      setError(t('photos.errorLoading'));
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, filters, t, sharedUserId]);

  // Reset everything when initialFilters or sharedUserId changes
  useEffect(() => {
    setPage(0);
    setPhotos([]);
    setHasMore(true);
    setError(null);
    
    // We don't call fetchPhotos here as it will be triggered by the page change
  }, [initialFilters, sharedUserId]);

  useEffect(() => {
    fetchPhotos();
  }, [page, fetchPhotos]);

  // Set up intersection observer with a more careful implementation
  useEffect(() => {
    if (loading || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    const options = {
      rootMargin: '100px',
      threshold: 0.1
    };
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        console.log('Loading more photos...');
        setPage(prevPage => prevPage + 1);
      }
    }, options);
    
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore]);

  // Update columns when photos change
  useEffect(() => {
    distributePhotosToColumns();
  }, [photos, distributePhotosToColumns]);

  // Navigation handler for scan page
  const handleNavigateToScan = () => {
    router.push('/settings/scan');
  };

  return (
    <div>
      {photos.length === 0 && !loading && !error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mb-4">{t('photos.noPhotosFound')}</p>
          <button
            onClick={handleNavigateToScan}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            {t('photos.scanLibrary')}
          </button>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => fetchPhotos()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex-1 flex flex-col gap-4">
              {column.map(photo => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  onClick={onPhotoSelect}
                  sharedUserId={sharedUserId}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <div className="flex justify-center py-4"></div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {hasMore && !loading && photos.length > 0 && (
        <div ref={loadingRef} className="h-16 my-4"></div>
      )}
    </div>
  );
};

export default SharePhotoGallery;