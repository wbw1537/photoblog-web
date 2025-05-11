'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
  id?: string;
}

const SidebarNav: React.FC = () => {
  const t = useTranslations();
  const pathname = usePathname();

  // Initialize with stored expanded state or default
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  
  // Load expanded state from localStorage on mount
  useEffect(() => {
    try {
      const storedState = localStorage.getItem('navExpandedSections');
      if (storedState) {
        setExpandedSections(JSON.parse(storedState));
      } else {
        // Default state if nothing stored
        setExpandedSections({ photos: true });
      }
    } catch (e) {
      console.error('Error loading navigation state', e);
      setExpandedSections({ photos: true });
    }
  }, []);
  
  // Auto-expand sections with active children
  useEffect(() => {
    navItems.forEach(item => {
      if (item.children?.some(child => pathname === child.href) && item.id) {
        setExpandedSections(prev => ({
          ...prev,
          [item.id]: true
        }));
      }
    });
  }, [pathname]);
  
  // Save expanded state to localStorage when it changes
  useEffect(() => {
    if (Object.keys(expandedSections).length > 0) {
      localStorage.setItem('navExpandedSections', JSON.stringify(expandedSections));
    }
  }, [expandedSections]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const photoNavItems: NavItem = {
    label: t('common.photos'),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    id: 'photos',
    children: [
      {
        label: t('photos.all'),
        href: '/photos',
        icon: null
      },
      {
        label: t('photos.favorites'),
        href: '/photos/favorites',
        icon: null
      },
      {
        label: t('photos.recent'),
        href: '/photos/recent',
        icon: null
      },
      {
        label: t('photos.albums'),
        href: '/photos/albums',
        icon: null
      }
    ]
  }

  const blogNavItems: NavItem = {
    label: t('common.blogs'),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    id: 'blogs',
    children: [
      {
        label: t('blogs.all'),
        href: '/blogs',
        icon: null
      }
    ]
  }

  const shareSpaceItems: NavItem = {
    label: t('common.shareSpace'),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    id: 'shareSpace',
    children: [
      {
        label: t('common.photos'),
        href: '/share/photos',
        icon: null
      },
      {
        label: t('common.blogs'),
        href: '/share/blogs',
        icon: null
      },
      {
        label: t('shareSpace.management'),
        href: '/share/management',
        icon: null
      }
    ]
  }

  const settingsNavItems: NavItem = {
    label: t('common.settings'),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.4 0-8-1.8-8-4V9c0-2.2 3.6-4 8-4s8 1.8 8 4v5c0 2.2-3.6 4-8 4z" />
      </svg>
    ),
    id: 'settings',
    children: [
      {
        label: t('photos.scan'),
        href: '/settings/scan',
        icon: null
      },
      {
        label: t('common.profile'),
        href: '/settings/profile',
        icon: null
      }
    ]
  }

  const navItems: NavItem[] = [photoNavItems, blogNavItems, shareSpaceItems, settingsNavItems];

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const hasActiveChild = hasChildren && item.children?.some(child => pathname === child.href);
    const isExpanded = item.id ? expandedSections[item.id] : false;

    return (
      <div key={item.label} className="mb-1">
        {hasChildren ? (
          <>
            <div
              className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors 
                ${hasActiveChild ? '' : ''} text-gray-700 hover:bg-gray-100`}
              onClick={() => item.id && toggleSection(item.id)}
              aria-expanded={isExpanded}
            >
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">{item.icon}</span>
                <span className="text-base">{item.label}</span>
              </div>
              <span className="text-gray-500 transition-transform duration-200" style={{ 
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <div 
              className="overflow-hidden transition-all duration-200 ease-in-out" 
              style={{ 
                maxHeight: isExpanded ? '400px' : '0px', 
                opacity: isExpanded ? 1 : 0 
              }}
            >
              {item.children && (
                <div className="ml-7 pl-2 mt-1 space-y-1 border-l border-gray-200">
                  {item.children.map((child) => (
                    <Link key={child.label} href={child.href || '#'}>
                      <div
                        className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                          pathname === child.href ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {child.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <Link href={item.href || '#'}>
            <div
              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`mr-3 ${isActive ? 'text-indigo-500' : 'text-gray-500'}`}>{item.icon}</span>
              {item.label}
            </div>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full py-6">
      <div className="px-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('common.photoBlog')}</h2>
      </div>

      <nav className="space-y-1 px-2">
        {navItems.map((item) => renderNavItem(item))}
      </nav>
    </div>
  );
};

export default SidebarNav;