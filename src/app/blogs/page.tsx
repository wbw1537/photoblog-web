'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SidebarNav from '@/components/common/sidebar-nav.component';
import BlogsToolbar from '@/components/blogs/blogs-toolbar.component';
import BlogGallery from '@/components/blogs/blog-gallery.component';
import { Blog, BlogRequest, BlogType, MediaType } from '@/types/blog.type';
import { blogApi } from '@/lib/api/blog.api';
import { photoFileApi } from '@/lib/api/photo-file.api';
import { logError } from '@/lib/utils/error.util';
import Image from 'next/image';

const BlogsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedBlogType, setSelectedBlogType] = useState<BlogType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});
  const t = useTranslations();
  
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleBlogTypeChange = useCallback((type: BlogType | undefined) => {
    setSelectedBlogType(type);
  }, []);

  const handleBlogSelect = useCallback((blog: Blog) => {
    setSelectedBlog(blog);
    // Reset media URLs when selecting a new blog
    setMediaUrls({});
    setLoadingMedia({});
    // You could also navigate to a detail page
    // router.push(`/blogs/${blog.id}`);
  }, []);
  
  // Prepare filters based on the current view
  const filters: Partial<BlogRequest> = {
    title: searchQuery || undefined,
    blogType: selectedBlogType,
    // Add skip and take to make it a valid BlogRequest
    skip: 0, 
    take: 10
  };
  
  // Check API connectivity when component mounts
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        // Simple API test with safe error handling
        await blogApi.getBlogList({ skip: 0, take: 1 });
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
  
  // Fetch media for the selected blog
  useEffect(() => {
    if (!selectedBlog || !selectedBlog.blogMedia || selectedBlog.blogMedia.length === 0) return;
    
    const objectUrls: string[] = [];
    
    // Function to fetch single media item
    const fetchMedia = async (mediaId: string) => {
      if (mediaUrls[mediaId] || loadingMedia[mediaId]) return;
      
      setLoadingMedia(prev => ({ ...prev, [mediaId]: true }));
      
      try {
        console.log(`Fetching detail image for mediaId: ${mediaId}`);
        // Use getMedia instead of getPhotoFile for blog media
        const response = await photoFileApi.getMedia(mediaId);
        
        const objectUrl = URL.createObjectURL(response.data);
        objectUrls.push(objectUrl);
        setMediaUrls(prev => ({ ...prev, [mediaId]: objectUrl }));
      } catch (err) {
        console.error('Error fetching detail image:', err);
        logError(err);
      } finally {
        setLoadingMedia(prev => ({ ...prev, [mediaId]: false }));
      }
    };
    
    // Fetch all media items for the selected blog
    selectedBlog.blogMedia.forEach(media => {
      if (media && media.mediaId) {
        fetchMedia(media.mediaId);
      } else {
        console.error('Invalid media object or missing mediaId', media);
      }
    });
    
    // Cleanup function to revoke object URLs
    return () => {
      objectUrls.forEach(URL.revokeObjectURL);
    };
  }, [selectedBlog, mediaUrls, loadingMedia]);
  
  // Close blog detail view
  const handleCloseDetail = () => {
    setSelectedBlog(null);
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
  
  // Check if the selected blog has media to prevent errors
  const hasBlogMedia = selectedBlog?.blogMedia && Array.isArray(selectedBlog.blogMedia) && selectedBlog.blogMedia.length > 0;
  // Check if the selected blog has tags to prevent errors
  const hasBlogTags = selectedBlog?.tags && selectedBlog.tags.length > 0;
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNav />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <BlogsToolbar 
          onSearch={handleSearch}
          onBlogTypeChange={handleBlogTypeChange} 
          selectedBlogType={selectedBlogType} 
        />
        
        {/* Blog gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          <BlogGallery 
            initialFilters={filters}
            onBlogSelect={handleBlogSelect}
          />
        </div>
      </div>
      
      {/* Blog detail modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{selectedBlog.title}</h3>
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
              {/* Blog detail view */}
              <div className="flex flex-col space-y-4">
                {/* Blog type */}
                <div className="text-sm text-gray-500">
                  {selectedBlog.blogType === BlogType.Article ? t('blogs.article') : t('blogs.photoPost')}
                </div>

                {/* Blog content */}
                <div className="prose max-w-none">
                  {selectedBlog.content || ''}
                </div>
                
                {/* Blog media - only render if exists */}
                {hasBlogMedia && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {selectedBlog.blogMedia.map(media => {
                      // Skip invalid media objects
                      if (!media || !media.mediaId) return null;
                      
                      const isLoading = loadingMedia[media.mediaId];
                      const imageUrl = mediaUrls[media.mediaId];
                      
                      return (
                        <div key={media.id} className="relative aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                          {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                              <svg className="w-8 h-8 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16l4-4m0 0l4 4m-4-4v8m8-16l4 4m0 0l4-4m-4 4V4"/>
                              </svg>
                            </div>
                          ) : imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={`Media for ${selectedBlog.title}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Tags - only render if exists */}
                {hasBlogTags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedBlog.tags.map(tag => (
                      <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Blog metadata */}
                <div className="text-sm text-gray-500 mt-4">
                  {t('blogs.postedOn')}: {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;