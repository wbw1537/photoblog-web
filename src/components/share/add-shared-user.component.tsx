'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { sharedUserApi } from '@/lib/api/shared-user.api';
import { PublicUserInfo, SharedUserInitRequestDTO } from '@/types/shared-user.type';
import { logError } from '@/lib/utils/error.util';

enum StepState {
  EnterRemoteAddress = 0,
  SelectUser = 1,
  EnterComment = 2,
  RequestSent = 3,
}

const AddSharedUser: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<StepState>(StepState.EnterRemoteAddress);
  const [remoteAddress, setRemoteAddress] = useState<string>('');
  const [remoteAddressError, setRemoteAddressError] = useState<string | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<PublicUserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<PublicUserInfo | null>(null);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle remote address submission
  const handleRemoteAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRemoteAddressError(null);
    
    if (!remoteAddress.trim()) {
      setRemoteAddressError(t('shareSpace.remoteAddressInvalid'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await sharedUserApi.getPublicUserInfo(remoteAddress);
      if (response.data && Array.isArray(response.data.users) && response.data.users.length > 0) {
        setRemoteUsers(response.data.users);
        setCurrentStep(StepState.SelectUser);
      } else {
        setError(t('shareSpace.noUsersFound'));
      }
    } catch (err) {
      logError(err);
      setError(t('shareSpace.errorFetchingUsers'));
    } finally {
      setLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (user: PublicUserInfo) => {
    setSelectedUser(user);
    setCurrentStep(StepState.EnterComment);
  };

  // Handle comment submission and send request
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const requestData: SharedUserInitRequestDTO = {
        requestToUserInfo: {
          id: selectedUser.id,
          address: selectedUser.address
        },
        comment
      };
      
      await sharedUserApi.initSharingRequest(requestData);
      setCurrentStep(StepState.RequestSent);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/share/management');
      }, 3000);
    } catch (err) {
      logError(err);
      setError(t('shareSpace.errorFetchingUsers'));
    } finally {
      setLoading(false);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    if (currentStep === StepState.SelectUser) {
      setCurrentStep(StepState.EnterRemoteAddress);
    } else if (currentStep === StepState.EnterComment) {
      setCurrentStep(StepState.SelectUser);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[0, 1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step < 3 ? step + 1 : '✓'}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 ${
                  currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <div className="w-10 text-center text-xs">{t('shareSpace.remoteAddressTitle')}</div>
          <div className="w-10 text-center text-xs">{t('shareSpace.selectUser')}</div>
          <div className="w-10 text-center text-xs">{t('shareSpace.enterComment')}</div>
          <div className="w-10 text-center text-xs">{t('shareSpace.requestSent')}</div>
        </div>
      </div>
    );
  };

  // Render enter remote address step
  const renderEnterRemoteAddress = () => {
    return (
      <form onSubmit={handleRemoteAddressSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{t('shareSpace.remoteAddressTitle')}</h2>
          <p className="text-gray-600 mt-1">{t('shareSpace.remoteAddressDescription')}</p>
        </div>
        
        <div>
          <label htmlFor="remoteAddress" className="block text-sm font-medium text-gray-700">
            {t('shareSpace.address')}
          </label>
          <input
            type="text"
            id="remoteAddress"
            value={remoteAddress}
            onChange={(e) => setRemoteAddress(e.target.value)}
            placeholder={t('shareSpace.remoteAddressPlaceholder')}
            className={`mt-1 block w-full rounded-md border ${
              remoteAddressError ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          />
          {remoteAddressError && (
            <p className="mt-2 text-sm text-red-600">{remoteAddressError}</p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('shareSpace.next')}
          </button>
        </div>
      </form>
    );
  };

  // Render select user step
  const renderSelectUser = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{t('shareSpace.selectUserTitle')}</h2>
          <p className="text-gray-600 mt-1">{t('shareSpace.selectUserDescription')}</p>
        </div>

        {remoteUsers.length > 0 ? (
          <div className="overflow-x-auto">
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
                    {t('shareSpace.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {remoteUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {t('shareSpace.selectUser')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">{t('shareSpace.loadingUsers')}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => handleRemoteAddressSubmit({ preventDefault: () => {} } as React.FormEvent)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              {t('shareSpace.tryAgain')}
            </button>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('shareSpace.back')}
          </button>
        </div>
      </div>
    );
  };

  // Render enter comment step
  const renderEnterComment = () => {
    return (
      <form onSubmit={handleCommentSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{t('shareSpace.enterCommentTitle')}</h2>
          <p className="text-gray-600 mt-1">{t('shareSpace.enterCommentDescription')}</p>
        </div>

        {selectedUser && (
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-medium">{selectedUser.name}</p>
            <p className="text-sm text-gray-600">{selectedUser.email}</p>
            <p className="text-sm text-gray-600">{selectedUser.address}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            {t('shareSpace.comment')}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder={t('shareSpace.commentPlaceholder')}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('shareSpace.back')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('shareSpace.sendRequest')}
          </button>
        </div>
      </form>
    );
  };

  // Render request sent step
  const renderRequestSent = () => {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{t('shareSpace.requestSentTitle')}</h2>
          <p className="text-gray-600 mt-1">{t('shareSpace.requestSentDescription')}</p>
          <p className="text-gray-600 mt-4">{t('shareSpace.redirectingToManagement')}</p>
        </div>
        <button
          onClick={() => router.push('/share/management')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('shareSpace.backToManagement')}
        </button>
      </div>
    );
  };

  // Render appropriate step based on current state
  const renderCurrentStep = () => {
    switch (currentStep) {
      case StepState.EnterRemoteAddress:
        return renderEnterRemoteAddress();
      case StepState.SelectUser:
        return renderSelectUser();
      case StepState.EnterComment:
        return renderEnterComment();
      case StepState.RequestSent:
        return renderRequestSent();
      default:
        return renderEnterRemoteAddress();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('shareSpace.addUser')}</h1>
      {renderStepIndicator()}
      <div className="bg-white shadow rounded-lg p-6">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default AddSharedUser;