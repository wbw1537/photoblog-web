'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Blog, BlogRequest, BlogType } from '@/types/blog.type';
import { blogApi } from '@/lib/api/blog.api';
import BlogCard from './share-blog-card.component';
import { useTranslations } from 'next-intl';
import { logError } from '@/lib/utils/error.util';

interface BlogGalleryProps {
  initialFilters?: Partial<BlogRequest>;
  onBlogSelect?: (blog: Blog) => void;
  sharedUserId: string;
}

const ShareBlogGallery: React.FC<BlogGalleryProps> = ({ initialFilters, onBlogSelect, sharedUserId }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const PAGE_SIZE = 10;

  // Create a stable filters object that won't change between renders
  const filters = useCallback(() => {
    return {
      ...initialFilters,
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE
    };
  }, [initialFilters, page, PAGE_SIZE]);

  const fetchBlogs = useCallback(async () => {
    if (loading || !sharedUserId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching blogs: page ${page}, size ${PAGE_SIZE} from shared user ID: ${sharedUserId}`);
      const currentFilters = filters();
      console.log('Filters:', currentFilters);
      
      // Use private API instead of the public one
      const response = await blogApi.privateGetBlogList(sharedUserId, currentFilters);
      
      // Ensure we have a valid response and items is an array
      if (response && response.data) {
        let blogItems: Blog[] = [];
        
        // Check if items exists and is an array
        if (Array.isArray(response.data.items)) {
          blogItems = response.data.items;
        } else if (Array.isArray(response.data)) {
          // If items doesn't exist but data is an array, use that
          blogItems = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Some APIs might nest data in a data property
          blogItems = response.data.data;
        }
        
        if (page === 0) {
          setBlogs(blogItems);
        } else {
          setBlogs(prev => [...prev, ...blogItems]);
        }
        
        setHasMore(blogItems.length === PAGE_SIZE);
      } else {
        // If response has unexpected format, treat as empty
        setBlogs(prev => page === 0 ? [] : prev);
        setHasMore(false);
      }
    } catch (err) {
      logError(err);
      setError(t('blogs.fetchError'));
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, filters, t, sharedUserId]);

  // Reset everything when initialFilters or sharedUserId changes
  useEffect(() => {
    setPage(0);
    setBlogs([]);
    setHasMore(true);
    setError(null);
    
    // We don't call fetchBlogs here as it will be triggered by the page change
  }, [initialFilters, sharedUserId]);

  useEffect(() => {
    fetchBlogs();
  }, [page, fetchBlogs]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (loading || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    const options = {
      rootMargin: '100px',
      threshold: 0.1
    };
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        console.log('Loading more blogs...');
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

  // Ensure blogs is always an array
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

  return (
    <div className="space-y-6">
      {safeBlogs.length === 0 && !loading && !error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">{t('blogs.noBlogs')}</p>
          <p className="text-gray-400 text-sm mt-2">{t('blogs.tryDifferentSearch')}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => fetchBlogs()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeBlogs.map(blog => (
            <BlogCard 
              key={blog.id} 
              blog={blog} 
              onClick={onBlogSelect}
              sharedUserId={sharedUserId}
            />
          ))}
        </div>
      )}
      
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {hasMore && !loading && safeBlogs.length > 0 && (
        <div ref={loadingRef} className="h-10 my-4"></div>
      )}
    </div>
  );
};

export default ShareBlogGallery;