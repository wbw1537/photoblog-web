'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { SharedUserResponse, SharedUserRequest, SharedUserStatus, SharedUserDirection } from '@/types/shared-user.type';
import { sharedUserApi } from '@/lib/api/shared-user.api';
import { logError } from '@/lib/utils/error.util';
import Link from 'next/link';

interface ShareManagementProps {
  initialFilters?: Partial<SharedUserRequest>;
}

const ShareManagement: React.FC<ShareManagementProps> = ({ initialFilters }) => {
  const [sharedUsers, setSharedUsers] = useState<SharedUserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 10;
  const t = useTranslations();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Create a stable filters object
  const filters = useCallback(() => {
    return {
      ...initialFilters,
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE
    };
  }, [initialFilters, page]);

  const fetchSharedUsers = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = filters();
      const response = await sharedUserApi.getSharedUsers(currentFilters as SharedUserRequest);
      
      if (Array.isArray(response.data.data)) {
        setSharedUsers(response.data.data);
      } else {
        setSharedUsers([response.data.data]);
      }
    } catch (err) {
      logError(err);
      setError(t('shareSpace.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  // Handle user actions (block, activate)
  const handleUserAction = async (userId: string, action: 'block' | 'activate') => {
    setActionLoading(userId);
    try {
      if (action === 'block') {
        const response = await sharedUserApi.setSharedUserBlocked(userId);
        if (response.status === 200) {
          await fetchSharedUsers();
        }
      } else if (action === 'activate') {
        const response = await sharedUserApi.setSharedUserActive(userId);
        if (response.status === 200) {
          await fetchSharedUsers();
        }
      }
    } catch (err) {
      logError(err);
      setError(t('shareSpace.actionFailed'));
    } finally {
      setActionLoading(null);
      setOpenDropdown(null);
    }
  };

  // Reset everything when initialFilters changes
  useEffect(() => {
    setPage(0);
    setSharedUsers([]);
    setError(null);
  }, [initialFilters]);

  useEffect(() => {
    fetchSharedUsers();
  }, [page, fetchSharedUsers]);

  const getStatusBadgeClass = (status: SharedUserStatus) => {
    switch (status) {
      case SharedUserStatus.Active:
        return 'bg-green-100 text-green-800';
      case SharedUserStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case SharedUserStatus.Blocked:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionBadgeClass = (direction: SharedUserDirection) => {
    switch (direction) {
      case SharedUserDirection.INCOMING:
        return 'bg-blue-100 text-blue-800';
      case SharedUserDirection.OUTGOING:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (userId: string) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t('shareSpace.managementTitle')}</h1>
        <Link 
          href="/share/management/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {t('shareSpace.addSharedUser')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={fetchSharedUsers} 
            className="ml-4 underline"
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {loading && sharedUsers.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : sharedUsers.length === 0 && !loading ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('shareSpace.noSharedUsers')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shareSpace.userName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shareSpace.email')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shareSpace.address')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shareSpace.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shareSpace.direction')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shareSpace.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sharedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.sharedUserName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.sharedUserEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.sharedUserAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                      {t(`shareSpace.status${user.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDirectionBadgeClass(user.direction)}`}>
                      {t(`shareSpace.direction${user.direction}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                    <button 
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => toggleDropdown(user.id)}
                      disabled={actionLoading === user.id}
                    >
                      {actionLoading === user.id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      )}
                    </button>
                    
                    {openDropdown === user.id && (
                      <div 
                        ref={dropdownRef}
                        className="fixed z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        style={{
                          top: 'auto',
                          right: 'auto',
                          transform: 'translateY(0)'
                        }}
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-gray-100"
                            onClick={() => {/* View action implementation */}}
                          >
                            {t('shareSpace.view')}
                          </button>
                          
                          {user.status === SharedUserStatus.Active && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                              onClick={() => handleUserAction(user.id, 'block')}
                            >
                              {t('shareSpace.block')}
                            </button>
                          )}
                          
                          {user.status === SharedUserStatus.Pending && user.direction === SharedUserDirection.INCOMING && (
                            <>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                                onClick={() => handleUserAction(user.id, 'activate')}
                              >
                                {t('shareSpace.activate')}
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                onClick={() => handleUserAction(user.id, 'block')}
                              >
                                {t('shareSpace.block')}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && sharedUsers.length > 0 && (
        <div className="flex justify-center py-4 mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`px-4 py-2 rounded ${
            page === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {t('shareSpace.previous')}
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!sharedUsers.length || sharedUsers.length < PAGE_SIZE}
          className={`px-4 py-2 rounded ${
            !sharedUsers.length || sharedUsers.length < PAGE_SIZE
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {t('shareSpace.next')}
        </button>
      </div>
    </div>
  );
};

export default ShareManagement;