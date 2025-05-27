// @ts-jsx
import { Home, Users, MessageCircle, Bell, Bookmark } from 'lucide-react';
import { Button } from '@/components/common/button';

const SidebarContent = () => {
  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Bookmark, label: 'Saved', href: '/saved' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map(item => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start text-left h-12 px-4"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default SidebarContent;
