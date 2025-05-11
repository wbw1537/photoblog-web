'use client'

import React, { useEffect, useState } from 'react';
import { userApi } from '@/lib/api/user.api';
import { UserResponse } from '@/types/user.type';
import { useTranslations } from 'next-intl';
import { logError } from '@/lib/utils/error.util';
import styles from './profile-page.module.css';

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
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>{t('common.profile')}</h1>
      </div>
      
      {user && (
        <div className={styles.profileContent}>
          <div className={styles.fieldGroup}>
            <label>{t('auth.userName')}</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            ) : (
              <div className={styles.fieldValue}>{user.name}</div>
            )}
          </div>
          
          <div className={styles.fieldGroup}>
            <label>{t('auth.email')}</label>
            <div className={styles.fieldValue}>
              <a href={`mailto:${user.email}`} className={styles.emailLink}>
                {user.email}
              </a>
            </div>
          </div>
          
          <div className={styles.fieldGroup}>
            <label>{t('basePath.basePath')}</label>
            {isEditing ? (
              <input
                type="text"
                name="basePath"
                value={formData.basePath || ''}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            ) : (
              <div className={styles.fieldValue}>{user.basePath}</div>
            )}
          </div>
          
          <div className={styles.fieldGroup}>
            <label>{t('auth.type')}</label>
            {isEditing ? (
              <input
                type="text"
                name="type"
                value={formData.type || ''}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            ) : (
              <div className={styles.fieldValue}>{user.type}</div>
            )}
          </div>
          
          <div className={styles.fieldGroup}>
            <label>{t('auth.address')}</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            ) : (
              <div className={styles.fieldValue}>
                <a 
                  href={`http://${user.address}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.addressLink}
                >
                  {user.address}
                </a>
              </div>
            )}
          </div>
          
          <div className={styles.fieldGroup}>
            <label>{t('auth.cachePath')}</label>
            {isEditing ? (
              <input
                type="text"
                name="cachePath"
                value={formData.cachePath || ''}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            ) : (
              <div className={styles.fieldValue}>{user.cachePath}</div>
            )}
          </div>
          
          <div className={styles.actionButtons}>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className={styles.saveButton}
                >
                  {t('profile.save')}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user); // Reset form data on cancel
                  }}
                  className={styles.cancelButton}
                >
                  {t('profile.cancel')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                {t('profile.edit')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;