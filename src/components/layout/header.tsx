'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import {
  Bell,
  CreditCard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { Input } from '@/components/common/input';
import SearchOverlay from '@/components/features/search-overlay';
import { useAuth } from '@/hooks/use-auth';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const notifications = 3;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-card border-b border-gray-200 dark:border-border z-30 px-4 flex items-center justify-between backdrop-blur-sm dark:backdrop-blur-sm">
      {/* Left section */}
      <div className="flex items-center">
        <div
          className="font-bold text-xl text-gray-900 dark:text-foreground cursor-pointer focus:outline-none"
          tabIndex={0}
          role="button"
          aria-label="Go to home"
          onClick={handleHomeClick}
          onKeyDown={handleHomeKeyDown}
        >
          SocialApp
        </div>
      </div>

      {/* Search bar - hidden on very small screens */}
      <div className="hidden sm:flex relative mx-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-9 h-9 border-gray-200 dark:border-border dark:bg-muted/20 dark:placeholder:text-muted-foreground/70 rounded-full focus-visible:ring-primary/30"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onFocus={() => {
              setSearchOverlayOpen(true);
            }}
          />
        </div>
      </div>

      {/* Search button - visible only on very small screens */}
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => {
          setSearchOverlayOpen(true);
        }}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-900">
            {notifications}
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="@user"
                  />
                  <AvatarFallback>
                    {user?.name?.substring(0, 2) || 'JD'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 mt-1 overflow-hidden"
              sideOffset={4}
            >
              <div className="flex items-center gap-2 p-2.5 pb-3 border-b border-border dark:border-border/60">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="@user"
                  />
                  <AvatarFallback>
                    {user?.name?.substring(0, 2) || 'JD'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 leading-none min-w-0">
                  <p className="font-medium text-base truncate">
                    {user?.name || 'Jane Doe'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate max-w-[130px]">
                    {user?.email || 'jane.doe@example.com'}
                  </p>
                </div>
              </div>

              <div className="px-1 py-1 text-sm text-muted-foreground border-b border-border/40 mx-1 pb-2 mt-1">
                Currently Online
              </div>

              <div className="p-1">
                <DropdownMenuItem className="my-0.5">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="my-0.5">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5 bg-border/50" />

                <DropdownMenuItem
                  className="my-0.5 text-destructive"
                  variant="destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenuContent
            align="end"
            className="w-56 mt-1 overflow-hidden"
            sideOffset={4}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>

        {/* Search Overlay */}
        <SearchOverlay
          isOpen={searchOverlayOpen}
          onClose={() => setSearchOverlayOpen(false)}
        />
      </header>
    </>
  );
}
