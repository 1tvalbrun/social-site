import { useEffect, useState } from 'react';

interface DebugInfo {
  isStandalone: boolean;
  isNavigatorStandalone: boolean;
  safeAreaTop: string;
  safeAreaBottom: string;
  safeAreaLeft: string;
  safeAreaRight: string;
  currentPath: string;
  userAgent: string;
  viewportHeight: string;
  viewportWidth: string;
  displayMode: string;
  devicePixelRatio: number;
  headerPadding: string;
  bottomPadding: string;
}

const PWADebug = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    isStandalone: false,
    isNavigatorStandalone: false,
    safeAreaTop: '',
    safeAreaBottom: '',
    safeAreaLeft: '',
    safeAreaRight: '',
    currentPath: '',
    userAgent: '',
    viewportHeight: '',
    viewportWidth: '',
    displayMode: '',
    devicePixelRatio: 1,
    headerPadding: '',
    bottomPadding: ''
  });

  // Add state for toggling visibility
  const [isVisible, setIsVisible] = useState(() => {
    // Load saved state from localStorage, default to true
    const saved = localStorage.getItem('pwa-debug-visible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save visibility state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pwa-debug-visible', JSON.stringify(isVisible));
  }, [isVisible]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const updateDebugInfo = () => {
        const headerElement = document.querySelector('.app-header');
        const bottomElement = document.querySelector('.bottom-navigation');
        
        setDebugInfo({
          isStandalone: window.matchMedia('(display-mode: standalone)').matches,
          isNavigatorStandalone: !!(window.navigator as any).standalone,
          safeAreaTop: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top'),
          safeAreaBottom: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom'),
          safeAreaLeft: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left'),
          safeAreaRight: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right'),
          currentPath: window.location.pathname,
          userAgent: navigator.userAgent.substring(0, 40) + '...',
          viewportHeight: `${window.innerHeight}px`,
          viewportWidth: `${window.innerWidth}px`,
          displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
          devicePixelRatio: window.devicePixelRatio,
          headerPadding: headerElement ? getComputedStyle(headerElement).paddingTop : 'N/A',
          bottomPadding: bottomElement ? getComputedStyle(bottomElement).paddingBottom : 'N/A'
        });
      };

      updateDebugInfo();

      // Update on resize and orientation change
      window.addEventListener('resize', updateDebugInfo);
      window.addEventListener('orientationchange', updateDebugInfo);
      
      return () => {
        window.removeEventListener('resize', updateDebugInfo);
        window.removeEventListener('orientationchange', updateDebugInfo);
      };
    }
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (import.meta.env.PROD) return null;

  return (
    <>
      {/* Toggle button - always visible at bottom-left */}
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 left-4 bg-black bg-opacity-90 text-white p-2 text-xs z-50 rounded-lg shadow-lg font-mono hover:bg-opacity-100 transition-all duration-200 flex items-center justify-center w-8 h-8"
        title={isVisible ? 'Hide PWA Debug Info' : 'Show PWA Debug Info'}
      >
        {isVisible ? '✕' : '🐛'}
      </button>

      {/* Debug info panel - positioned above the toggle button */}
      {isVisible && (
        <div className="fixed bottom-16 left-4 bg-black bg-opacity-95 text-white p-3 text-xs z-40 max-w-xs rounded-lg shadow-lg font-mono">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-green-400">PWA Debug Info</div>
            <button
              onClick={toggleVisibility}
              className="text-gray-400 hover:text-white ml-2 text-xs"
              title="Hide Debug Info"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1">
            <div>PWA Mode: {debugInfo.isStandalone ? '✅' : '❌'}</div>
            <div>iOS PWA: {debugInfo.isNavigatorStandalone ? '✅' : '❌'}</div>
            <div>Display: {debugInfo.displayMode}</div>
            <div className="text-yellow-400 font-semibold">Safe Areas:</div>
            <div>Top: {debugInfo.safeAreaTop || '0px'}</div>
            <div>Bottom: {debugInfo.safeAreaBottom || '0px'}</div>
            <div>Left: {debugInfo.safeAreaLeft || '0px'}</div>
            <div>Right: {debugInfo.safeAreaRight || '0px'}</div>
            <div className="text-cyan-400 font-semibold">Computed Padding:</div>
            <div>Header: {debugInfo.headerPadding}</div>
            <div>Bottom: {debugInfo.bottomPadding}</div>
            <div className="text-gray-400">Viewport: {debugInfo.viewportWidth} × {debugInfo.viewportHeight}</div>
            <div>DPR: {debugInfo.devicePixelRatio}</div>
            <div>Path: {debugInfo.currentPath}</div>
            <div className="pt-1 text-gray-400 text-xs truncate">
              UA: {debugInfo.userAgent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWADebug; 