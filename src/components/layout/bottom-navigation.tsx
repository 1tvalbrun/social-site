import { Home, Users, Grid, Bell, User } from 'lucide-react';

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around md:hidden z-30">
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-primary"
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
      >
        <Users className="h-5 w-5" />
        <span className="text-xs mt-1">Connections</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
      >
        <Grid className="h-5 w-5" />
        <span className="text-xs mt-1">Groups</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
      >
        <Bell className="h-5 w-5" />
        <span className="text-xs mt-1">Notifications</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </a>
    </div>
  );
}
