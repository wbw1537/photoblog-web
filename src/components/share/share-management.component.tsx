'use client'

import React, { useEffect, useState, useCallback } from 'react';
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
  const PAGE_SIZE = 10;
  const t = useTranslations();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t('shareSpace.managementTitle')}</h1>
        <Link 
          href="/shared/add"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      {t('shareSpace.view')}
                    </button>
                    {user.status !== SharedUserStatus.Blocked && (
                      <button className="text-red-600 hover:text-red-900">
                        {t('shareSpace.block')}
                      </button>
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