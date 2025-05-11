'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import CommonToolbar from '@/components/common/common-toolbar.component';
import { useTranslations } from 'next-intl';

interface PhotosToolbarProps {
  onSearch: (query: string) => void;
}

const PhotosToolbar: React.FC<PhotosToolbarProps> = ({ onSearch }) => {
  const t = useTranslations();
  const router = useRouter();

  const handleScan = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/settings/scan');
  };

  return (
    <CommonToolbar>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder={t('photos.search')}
          className="py-2 px-3 border border-gray-300 rounded-md"
          onChange={(e) => onSearch(e.target.value)}
        />
        
      </div>
      <div className="flex items-center justify-end space-x-4">
        <button className="text-gray-700 hover:text-indigo-600" title="Scan" onClick={handleScan}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M7 6h10M7 18h10" />
          </svg>
        </button>
      </div>
    </CommonToolbar>
  );
};

export default PhotosToolbar;