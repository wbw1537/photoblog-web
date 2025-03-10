'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { authApi } from '../../lib/api/auth.api';
import { UserType } from '../../types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { handleApiError, logError } from '@/lib/utils/error.util';

const PendingApprovalComponent: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();
  const { user, setUser } = useAuth();

  // Redirect if no user data or not pending
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    } else if (user.type !== UserType.Pending) {
      router.push('/');
    }
  }, [user, router]);

  const checkApprovalStatus = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Get current user info
      const response = await authApi.getUserInfo();
      
      // Update user context
      setUser(response.data);
      
      if (response.data.type !== UserType.Pending) {
        // User has been approved, redirect to home
        router.push('/');
      } else {
        // Still pending
        setError(t('auth.stillPending'));
      }
    } catch (err) {
      logError(err);
      const appError = handleApiError(err);
      
      // Handle specific error cases
      if (appError.code === 'AUTH_FAILED' 
        || (appError.originalError as { response?: { status: number } })?.response?.status === 401) {
        // Session expired, redirect to login
        router.push('/auth/login');
      } else {
        const errorMessage = t('auth.errorCheckingStatus');
        setError(errorMessage);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // If no user data, show loading or redirect handled by useEffect
  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="text-center py-8 space-y-6">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-yellow-100">
        <svg 
          className="w-8 h-8 text-yellow-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800">{t('auth.pendingTitle')}</h2>
      <p className="text-gray-600">{t('auth.pendingDescription')}</p>
      
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
          {error}
        </div>
      )}
      
      <button
        onClick={checkApprovalStatus}
        disabled={isRefreshing}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
          ${isRefreshing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {isRefreshing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('auth.checking')}
          </>
        ) : t('auth.refreshStatus')}
      </button>
    </div>
  );
};

export default PendingApprovalComponent;