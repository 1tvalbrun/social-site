'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Header from '@/components/layout/header';
import Feed from '@/components/features/feed';
import BottomNavigation from '@/components/layout/bottom-navigation';
import RightPanel from '@/components/layout/right-panel';
import SidebarContent from '@/components/layout/sidebar-content';
import { useMobile } from '@/hooks/use-mobile';

export default function SocialMediaHome() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ensure theme is available on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background text-gray-900 dark:text-gray-100">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex relative pt-16 pb-16 md:pb-0">
        {/* Left Sidebar - contains sponsored content, birthdays, etc. */}
        <div className="hidden lg:block w-72 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent />
        </div>

        {/* Main content */}
        <div className="flex-1 max-w-2xl mx-auto px-4 w-full">
          <Feed />
        </div>

        {/* Right Panel - contains online users, groups, and suggestions */}
        <div
          className={`${
            isMobile
              ? `fixed inset-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-200 ease-in-out`
              : 'sticky top-16 h-[calc(100vh-4rem)] w-72 flex-shrink-0'
          }`}
        >
          {(sidebarOpen || !isMobile) && (
            <>
              {isMobile && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              <RightPanel onClose={() => setSidebarOpen(false)} />
            </>
          )}
        </div>
      </div>

      {/* Bottom navigation - only on mobile */}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
