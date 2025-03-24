
'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const SidebarNav: React.FC = () => {
  const t = useTranslations();
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      label: t('photos.all'),
      href: '/photos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: t('photos.favorites'),
      href: '/photos/favorites',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      label: t('photos.recent'),
      href: '/photos/recent',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: t('photos.albums'),
      href: '/photos/albums',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full py-6">
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">{t('photos.library')}</h2>
      </div>
      
      <nav className="space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href}>
              <div
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-indigo-500' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNav;