'use client'

import React from 'react';
import CommonToolbar from '@/components/common/common-toolbar.component';

interface PhotosToolbarProps {
  onSearch: (query: string) => void;
}

const PhotosToolbar: React.FC<PhotosToolbarProps> = ({ onSearch }) => {
  return (
    <CommonToolbar>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search photos..."
          className="py-2 px-3 border border-gray-300 rounded-md"
          onChange={(e) => onSearch(e.target.value)}
        />
        <button className="text-gray-700 hover:text-indigo-600" title="Upload">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
        </button>
      </div>
    </CommonToolbar>
  );
};

export default PhotosToolbar;