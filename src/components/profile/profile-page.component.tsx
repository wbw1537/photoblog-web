'use client'

import React, { useEffect, useState } from 'react';
import { userApi } from '@/lib/api/user.api';
import { UserResponse } from '@/types/user.type';
import { useTranslations } from 'next-intl';
import { logError } from '@/lib/utils/error.util';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserResponse>>({});
  const t = useTranslations();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userApi.getUserInfo();
        setUser(response.data);
        setFormData(response.data);
      } catch (err) {
        logError(err);
        setError(t('common.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.modifyUserInfo(formData);
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      logError(err);
      setError(t('common.errorSaving'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('common.profile')}</h1>
      {user && (
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-semibold mb-1">
              {t('auth.userName')}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            ) : (
              <p className="text-gray-700">{user.name}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              {t('auth.email')}
            </label>
            <p>
              <a href={`mailto:${user.email}`} className="underline">
                {user.email}
              </a>
            </p>
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              {t('basePath.basePath')}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="basePath"
                value={formData.basePath || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            ) : (
              <p className="text-gray-700">{user.basePath}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              {t('auth.type')}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="type"
                value={formData.type || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            ) : (
              <p className="text-gray-700">{user.type}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              {t('auth.address')}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            ) : (
              <p>
                <a href={`http://${user.address}`} target="_blank" rel="noopener noreferrer" className="underline">
                  {user.address}
                </a>
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              {t('auth.cachePath')}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="cachePath"
                value={formData.cachePath || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            ) : (
              <p className="text-gray-700">{user.cachePath}</p>
            )}
          </div>
          {isEditing ? (
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {t('profile.save')}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                {t('profile.cancel')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {t('profile.edit')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;