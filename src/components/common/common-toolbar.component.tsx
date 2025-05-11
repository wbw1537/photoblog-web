'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/auth.context';
import Image from 'next/image';

interface CommonToolbarProps {
  children?: React.ReactNode;
}

const CommonToolbar: React.FC<CommonToolbarProps> = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const t = useTranslations();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      {/* Additional Controls */}
      <div className="flex items-center space-x-4">{children}</div>

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
              <a href="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {t('common.profile')}
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
  );
};

export default CommonToolbar;