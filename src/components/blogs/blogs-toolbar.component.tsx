'use client'

import React from 'react';
import CommonToolbar from '@/components/common/common-toolbar.component';
import { BlogType } from '@/types/blog.type';

interface BlogsToolbarProps {
  onSearch: (query: string) => void;
  onBlogTypeChange: (type: BlogType | undefined) => void;
  selectedBlogType?: BlogType;
}

const BlogsToolbar: React.FC<BlogsToolbarProps> = ({ onSearch, onBlogTypeChange, selectedBlogType }) => {
  return (
    <CommonToolbar>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search blogs..."
          className="py-2 px-3 border border-gray-300 rounded-md"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="flex items-center">
          <label htmlFor="blogType" className="mr-2 text-sm text-gray-700">Type:</label>
          <select
            id="blogType"
            className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedBlogType !== undefined ? selectedBlogType : ''}
            onChange={(e) => {
              const value = e.target.value;
              onBlogTypeChange(value === '' ? undefined : Number(value) as BlogType);
            }}
          >
            <option value="">All</option>
            <option value={BlogType.Article}>Article</option>
            <option value={BlogType.PhotoPost}>Photo Post</option>
          </select>
        </div>
      </div>
    </CommonToolbar>
  );
};

export default BlogsToolbar;