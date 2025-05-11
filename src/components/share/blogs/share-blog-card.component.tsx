'use client'

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Blog, BlogType } from '@/types/blog.type';
import { photoFileApi } from '@/lib/api/photo-file.api';
import { logError } from '@/lib/utils/error.util';

interface BlogCardProps {
  blog: Blog;
  onClick?: (blog: Blog) => void;
  sharedUserId: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onClick, sharedUserId }) => {
  const t = useTranslations();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Check if blog has media to prevent "Cannot read properties of undefined" error
  const hasBlogMedia = blog.blogMedia && Array.isArray(blog.blogMedia) && blog.blogMedia.length > 0;

  useEffect(() => {
    let objectUrl: string | null = null;
    
    const fetchBlogImage = async () => {
      // Early return if no media or blogMedia is not an array
      if (!hasBlogMedia) return;
      
      const media = blog.blogMedia[0];
      
      // Ensure mediaId exists
      if (!media || !media.mediaId) {
        console.error('Media or mediaId not found', media);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        console.log(`Fetching image for mediaId: ${media.mediaId} from shared user ID: ${sharedUserId}`);
        
        // Use the privateGetPhotoPreview method for blog media
        const response = await photoFileApi.privateGetPhotoPreview(media.mediaId, sharedUserId);
        
        // Create an object URL from the blob
        objectUrl = URL.createObjectURL(response.data);
        setImageUrl(objectUrl);
      } catch (err) {
        console.error('Error fetching image:', err);
        logError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogImage();
    
    // Clean up the object URL when the component unmounts
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [hasBlogMedia, blog.blogMedia, sharedUserId]);
  
  const handleClick = () => {
    if (onClick) onClick(blog);
  };

  // Format date to more readable format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncate content for preview
  const truncateContent = (content: string | null, maxLength: number = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Only render media if it exists and is loading or has loaded */}
      {hasBlogMedia && (
        <div className="w-full h-48 overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16l4-4m0 0l4 4m-4-4v8m8-16l4 4m0 0l4-4m-4 4V4"/>
              </svg>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-5">
        {/* Blog type badge */}
        <div className="flex justify-between items-center mb-2">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
            {blog.blogType === BlogType.Article ? t('blogs.article') : t('blogs.photoPost')}
          </span>
          <span className="text-xs text-gray-500">{formatDate(blog.createdAt)}</span>
        </div>
        
        {/* Blog title */}
        <h2 className="text-xl font-bold mb-2 text-gray-900">{blog.title}</h2>
        
        {/* Blog content preview */}
        <div className="text-gray-700 mb-3 text-sm line-clamp-3">
          {truncateContent(blog.content)}
        </div>
        
        {/* Footer area with tags and read more link */}
        <div className="pt-3 mt-3 border-t border-gray-100">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {blog.tags.slice(0, 3).map(tag => (
                <span key={tag.id} className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                  {tag.name}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                  +{blog.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Read more link */}
          <div className="flex justify-end">
            <span className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              {t('blogs.readMore')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;