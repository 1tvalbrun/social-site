import { Bell, Grid, Home, User, Users } from 'lucide-react';

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-card border-t border-gray-200 dark:border-border flex items-center justify-around md:hidden z-30 backdrop-blur-sm dark:backdrop-blur-sm">
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-primary"
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-muted-foreground"
      >
        <Users className="h-5 w-5" />
        <span className="text-xs mt-1">Connections</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-muted-foreground"
      >
        <Grid className="h-5 w-5" />
        <span className="text-xs mt-1">Groups</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-muted-foreground"
      >
        <Bell className="h-5 w-5" />
        <span className="text-xs mt-1">Notifications</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-muted-foreground"
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </a>
    </div>
  );
}
