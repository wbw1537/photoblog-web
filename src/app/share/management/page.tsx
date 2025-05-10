'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const ShareManagementPage: React.FC = () => {
  const t = useTranslations();
  const [ipv6Address, setIpv6Address] = useState('');
  const [ipv6Collection, setIpv6Collection] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Simple IPv6 validation
  const isValidIPv6 = (ip: string) => {
    // Basic IPv6 regex pattern
    const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/;
    return ipv6Pattern.test(ip);
  };

  const addIPv6Address = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!ipv6Address.trim()) {
      setError(t('shareSpace.emptyAddressError'));
      return;
    }

    if (!isValidIPv6(ipv6Address)) {
      setError(t('shareSpace.invalidAddressError'));
      return;
    }

    if (ipv6Collection.includes(ipv6Address)) {
      setError(t('shareSpace.duplicateAddressError'));
      return;
    }

    setIpv6Collection([...ipv6Collection, ipv6Address]);
    setIpv6Address('');
    setSuccess(t('shareSpace.addressAddedSuccess'));
  };

  const removeIPv6Address = (addressToRemove: string) => {
    setIpv6Collection(ipv6Collection.filter(address => address !== addressToRemove));
    setSuccess(t('shareSpace.addressRemovedSuccess'));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t('shareSpace.managementTitle')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('shareSpace.addIpv6Address')}</h2>
        <form onSubmit={addIPv6Address} className="space-y-4">
          <div>
            <label htmlFor="ipv6Address" className="block text-sm font-medium text-gray-700 mb-1">
              {t('shareSpace.ipv6AddressLabel')}
            </label>
            <input
              type="text"
              id="ipv6Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('shareSpace.ipv6AddressPlaceholder')}
              value={ipv6Address}
              onChange={(e) => setIpv6Address(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {t('shareSpace.addButtonLabel')}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t('shareSpace.ipv6AddressList')}</h2>
        {ipv6Collection.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('shareSpace.noAddressesFound')}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {ipv6Collection.map((address, index) => (
              <li key={index} className="py-4 flex justify-between items-center">
                <span className="font-mono text-gray-800">{address}</span>
                <button
                  onClick={() => removeIPv6Address(address)}
                  className="text-red-600 hover:text-red-800"
                  aria-label={t('shareSpace.removeAddress')}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {t('shareSpace.ipv6AddressInfoText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareManagementPage;