
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { authApi } from '../../lib/api/auth.api';
import { RegisterRequest } from '../../types/auth.type';

const SelectBasePathForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({ name: '', email: '', password: '', basePath: '' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    // Retrieve form data from sessionStorage
    const savedData = sessionStorage.getItem('registrationData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      // If no data is found, redirect back to registration page
      router.push('/auth/register');
    }
  }, [router]);

  const handleBasePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, basePath: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authApi.register(formData);
      console.log('Registered:', response.data);
      
      // Clear the stored data
      sessionStorage.removeItem('registrationData');
      
      // Redirect to login after successful registration
      router.push('/auth/login'); 
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(t('auth.registrationFailed'));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
          {error}
        </div>
      )}
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{t('auth.selectBasePathTitle')}</h2>
        <p className="text-gray-600">{t('auth.selectBasePathSubtitle')}</p>
      </div>
      
      <div>
        <label htmlFor="basePath" className="block text-sm font-medium text-gray-700">
          {t('auth.basePath')}
        </label>
        <div className="flex mt-1">
          <input
            type="text"
            name="basePath"
            id="basePath"
            value={formData.basePath}
            onChange={handleBasePathChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={() => document.getElementById('fileSelector')?.click()}
            className="px-4 py-2 border border-gray-300 border-l-0 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none"
          >
            {t('auth.browse')}
          </button>
          <input
            type="file"
            id="fileSelector"
            className="hidden"
            webkitdirectory="true"
            directory="true"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const path = e.target.files[0].webkitRelativePath.split('/')[0];
                setFormData({ ...formData, basePath: path });
              }
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{t('auth.basePathHelp')}</p>
      </div>
      
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('auth.completeRegistration')}
        </button>
      </div>
    </form>
  );
};

export default SelectBasePathForm;