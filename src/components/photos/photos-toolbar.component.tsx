
'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/auth.context';
import Image from 'next/image';

interface PhotosToolbarProps {
  onSearch: (query: string) => void;
}

const PhotosToolbar: React.FC<PhotosToolbarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const { user, logout } = useAuth();
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      {/* Search */}
      <div className="w-1/3">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('photos.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      
      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        <button 
          className="text-gray-700 hover:text-indigo-600"
          title={t('photos.upload')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
        </button>
        
        {/* User menu */}
        <div className="relative">
          <button 
            className="flex items-center text-sm focus:outline-none"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <Image 
                  src={user.avatarUrl} 
                  alt={user.name || 'User'} 
                  width={32} 
                  height={32} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-700 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {t('common.profile')}
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {t('common.settings')}
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {t('auth.signOut')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotosToolbar;