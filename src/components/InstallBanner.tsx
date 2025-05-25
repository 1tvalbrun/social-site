import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallBannerProps {
  className?: string;
}

const BANNER_STORAGE_KEY = 'pwa-install-banner-dismissed';
const ENGAGEMENT_STORAGE_KEY = 'pwa-user-engagement';
const MIN_PAGE_VIEWS = 3;
const MIN_TIME_SPENT = 30000; // 30 seconds
const AUTO_HIDE_DELAY = 7000; // 7 seconds

export function InstallBanner({ className = '' }: InstallBannerProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check if user has sufficient engagement
  const checkUserEngagement = useCallback(() => {
    const engagement = localStorage.getItem(ENGAGEMENT_STORAGE_KEY);
    const engagementData = engagement ? JSON.parse(engagement) : { pageViews: 0, timeSpent: 0 };
    
    return engagementData.pageViews >= MIN_PAGE_VIEWS || engagementData.timeSpent >= MIN_TIME_SPENT;
  }, []);

  // Track user engagement
  const trackEngagement = useCallback(() => {
    const engagement = localStorage.getItem(ENGAGEMENT_STORAGE_KEY);
    const engagementData = engagement ? JSON.parse(engagement) : { pageViews: 0, timeSpent: 0, startTime: Date.now() };
    
    // Increment page views
    engagementData.pageViews += 1;
    
    // Track time spent
    if (engagementData.startTime) {
      engagementData.timeSpent += Date.now() - engagementData.startTime;
    }
    engagementData.startTime = Date.now();
    
    localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(engagementData));
  }, []);

  // Check if banner was previously dismissed
  const wasBannerDismissed = useCallback(() => {
    const dismissed = localStorage.getItem(BANNER_STORAGE_KEY);
    if (!dismissed) return false;
    
    const dismissedData = JSON.parse(dismissed);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    // Reset dismissal after 24 hours
    if (dismissedData.timestamp < oneDayAgo) {
      localStorage.removeItem(BANNER_STORAGE_KEY);
      return false;
    }
    
    return true;
  }, []);

  // Check if app is already installed
  const isAppInstalled = useCallback(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }, []);

  // Check if device is mobile
  const isMobileDevice = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }, []);

  // Handle install prompt
  const handleInstall = async () => {
    if (!installPrompt) return;
    
    setIsInstalling(true);
    
    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowBanner(false);
        setIsVisible(false);
      } else {
        console.log('User dismissed the install prompt');
        dismissBanner();
      }
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setIsInstalling(false);
      setInstallPrompt(null);
    }
  };

  // Handle banner dismissal
  const dismissBanner = useCallback(() => {
    const dismissalData = {
      timestamp: Date.now(),
      count: 1
    };
    
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(dismissalData));
    setShowBanner(false);
    setIsVisible(false);
  }, []);

  // Auto-hide banner after delay
  useEffect(() => {
    if (showBanner && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300); // Wait for animation
      }, AUTO_HIDE_DELAY);
      
      return () => clearTimeout(timer);
    }
  }, [showBanner, isVisible]);

  // Set up install prompt listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      
      // Check conditions to show banner
      if (!wasBannerDismissed() && 
          !isAppInstalled() && 
          isMobileDevice() && 
          checkUserEngagement()) {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100); // Slight delay for animation
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowBanner(false);
      setIsVisible(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Track engagement on mount
    trackEngagement();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [wasBannerDismissed, isAppInstalled, isMobileDevice, checkUserEngagement, trackEngagement]);

  if (!showBanner || isAppInstalled()) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      } ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <div className="flex items-center space-x-3 flex-1">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Install ICGJC App</p>
              <p className="text-xs opacity-90 truncate">
                Add to home screen for quick access
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling || !installPrompt}
              className="bg-white text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium 
                         hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center space-x-1"
            >
              {isInstalling ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isInstalling ? 'Installing...' : 'Install'}</span>
            </button>
            
            <button
              onClick={dismissBanner}
              className="text-white hover:text-blue-200 transition-colors duration-200 p-1"
              aria-label="Dismiss install banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallBanner; 