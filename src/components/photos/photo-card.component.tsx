'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Photo } from '@/types/photo.type';
import { photoFileApi } from '@/lib/api/photo-file.api';
import { logError } from '@/lib/utils/error.util';
import { FileResolution, PhotoViewRequest } from '@/types/photo-file.type';

interface PhotoCardProps {
  photo: Photo;
  onClick?: (photo: Photo) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number>(2/3); // Default aspect ratio
  
  useEffect(() => {
    let objectUrl: string | null = null;
    
    const fetchImage = async () => {
      if (!photo.files || photo.files.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        // Use the photoFileApi to fetch the image
        const photoViewRequest: PhotoViewRequest = {
          resolution: FileResolution.PREVIEW
        }
        const response = await photoFileApi.getPhotoView(photo.files[0].id, photoViewRequest);
        
        // Create an object URL from the blob
        objectUrl = URL.createObjectURL(response.data);
        setImageUrl(objectUrl);
        
        // Simply calculate aspect ratio from width and height if available
        if (photo.files[0].imageWidth && photo.files[0].imageHeight) {
          setAspectRatio(photo.files[0].imageWidth / photo.files[0].imageHeight);
        } else if (photo.files[0].imageWidth && photo.files[0].imageHeight) {
          setAspectRatio(photo.files[0].imageWidth / photo.files[0].imageHeight);
        }
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImage();
    
    // Clean up the object URL when the component unmounts
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [photo.files, photo.files[0].imageWidth, photo.files[0].imageHeight]);
  
  // Calculate padding-bottom based on aspect ratio to maintain proper dimensions
  const paddingBottom = `${(1 / aspectRatio) * 100}%`;
  
  // Format exposure time (e.g. 1/250)
  const formatExposureTime = (time: number | null): string => {
    if (!time) return '-';
    if (time >= 1) return `${time}s`;
    return `1/${Math.round(1/time)}s`;
  };

  const handleClick = () => {
    if (onClick) onClick(photo);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="relative w-full" style={{ paddingBottom }}>
        {loading ? (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16l4-4m0 0l4 4m-4-4v8m8-16l4 4m0 0l4-4m-4 4V4"/>
            </svg>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={photo.title || 'Photo'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      {/* Title overlay - always visible */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
        <h3 className="text-sm font-medium truncate">{photo.title}</h3>
      </div>
      
      {/* Metadata overlay - visible on hover */}
      {isHovering && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-2 text-white text-xs flex gap-2">
          {photo.fNumber && (
            <div className="bg-black/50 px-2 py-1 rounded-full">{`ƒ/${photo.fNumber}`}</div>
          )}
          {photo.exposureTime && (
            <div className="bg-black/50 px-2 py-1 rounded-full">{formatExposureTime(photo.exposureTime)}</div>
          )}
          {photo.iso && (
            <div className="bg-black/50 px-2 py-1 rounded-full">{`ISO ${photo.iso}`}</div>
          )}
          {photo.focalLength && (
            <div className="bg-black/50 px-2 py-1 rounded-full">{`${photo.focalLength}mm`}</div>
          )}
        </div>
      )}
      
      {/* Liked indicator */}
      {photo.liked && (
        <div className="absolute top-2 right-2">
          <span className="text-red-500">❤</span>
        </div>
      )}
    </div>
  );
};

export default PhotoCard;