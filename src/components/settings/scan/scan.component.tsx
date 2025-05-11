'use client';

import React, { useState, useEffect } from 'react';
import { photoScanApi } from '@/lib/api/photo-scan.api';
import { scanStatusApi } from '@/lib/api/scan-status.api';
import { ScanStatus, JobStatusType } from '@/types/scan-status.type';
import styles from './scan.module.css';
import { useTranslations } from 'next-intl';

export const ScanComponent: React.FC = () => {
    const [isDeltaScan, setIsDeltaScan] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
const t = useTranslations();

  const handleScan = async () => {
    setIsScanning(true);
    setScanStatus(null);
    
    try {
      const response = isDeltaScan 
        ? await photoScanApi.deltaScan()
        : await photoScanApi.scan();
      
      // Start polling for status
      const id = setInterval(fetchScanStatus, 1000);
      setIntervalId(id);
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
    }
  };

  const fetchScanStatus = async () => {
    try {
      const { data } = await scanStatusApi.getScanStatus();
      setScanStatus(data);
      
      if (data.status === JobStatusType.COMPLETED || data.status === JobStatusType.ERROR) {
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
        setIsScanning(false);
      }
    } catch (error) {
      console.error('Error fetching scan status:', error);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsScanning(false);
    }
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const getProgressPercentage = (): number => {
    if (!scanStatus) return 0;
    
    if (scanStatus.status === JobStatusType.COMPLETED) return 100;
    
    if (scanStatus.photosIncreased > 0) {
      return Math.round((scanStatus.photosIncreasedScanned / scanStatus.photosIncreased) * 100);
    }
    
    return 0;
  };

  const getStatusDisplay = (status: JobStatusType): string => {
    switch (status) {
      case JobStatusType.INITIALIZING:
        return t('photos.statusInitializing');
      case JobStatusType.IN_PROGRESS:
        return t('photos.statusInProgress');
      case JobStatusType.COMPLETED:
        return t('photos.statusCompleted');
      case JobStatusType.ERROR:
        return t('photos.statusError');
      default:
        return status.replace('_', ' ').toUpperCase();
    }
  };

  return (
    <div className={styles.scanContainer}>
      <div className={styles.scanHeader}>
        <h2>{t('photos.scanLibrary')}</h2>
        <p>{t('photos.scanDescription')}</p>
      </div>

      <div className={styles.scanControls}>
        <div className={styles.scanTypeToggle}>
          <span className={!isDeltaScan ? styles.active : ''}>{t('photos.fullScan')}</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isDeltaScan}
              onChange={() => setIsDeltaScan(!isDeltaScan)}
              disabled={isScanning}
            />
            <span className={styles.slider}></span>
          </label>
          <span className={isDeltaScan ? styles.active : ''}>{t('photos.deltaScan')}</span>
        </div>
        
        <button 
          className={styles.scanButton}
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? t('common.loading') : t(isDeltaScan ? 'photos.startDeltaScan' : 'photos.startFullScan')}
        </button>
      </div>

      {isScanning && !scanStatus && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{t('photos.initializingScan')}</p>
        </div>
      )}

      {scanStatus && (
        <div className={styles.statusContainer}>
          <div className={styles.statusHeader}>
            <h3>{t('photos.scanStatusTitle')}: {getStatusDisplay(scanStatus.status)}</h3>
            {scanStatus.status === JobStatusType.IN_PROGRESS && (
              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
                <span>{getProgressPercentage()}%</span>
              </div>
            )}
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span>{t('photos.photosIncreased')}</span>
              <strong>{scanStatus.photosIncreased}</strong>
            </div>
            <div className={styles.statItem}>
              <span>{t('photos.photosIncreasedScanned')}</span>
              <strong>{scanStatus.photosIncreasedScanned}</strong>
            </div>
            <div className={styles.statItem}>
              <span>{t('photos.photosNotMatched')}</span>
              <strong>{scanStatus.photosNotMatched}</strong>
            </div>
            <div className={styles.statItem}>
              <span>{t('photos.photosNotMatchedMatchedWithIncrease')}</span>
              <strong>{scanStatus.photosNotMatchedMatchedWithIncrease}</strong>
            </div>
            <div className={styles.statItem}>
              <span>{t('photos.photosNotMatchedDeleted')}</span>
              <strong>{scanStatus.photosNotMatchedDeleted}</strong>
            </div>
            <div className={styles.statItem}>
              <span>{t('photos.photosMatched')}</span>
              <strong>{scanStatus.photosMatched}</strong>
            </div>
            <div className={styles.statItem}>
              <span>{t('photos.photosMatchedUpdated')}</span>
              <strong>{scanStatus.photosMatchedUpdated}</strong>
            </div>
          </div>

          {scanStatus.status === JobStatusType.ERROR && (
            <div className={styles.errorMessage}>
              <p>{t('photos.scanErrorMessage')}</p>
            </div>
          )}

          {scanStatus.status === JobStatusType.COMPLETED && (
            <div className={styles.completedMessage}>
              <p>{t('photos.scanCompletedMessage')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};