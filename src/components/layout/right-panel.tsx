import { X } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import { Card, CardContent } from '@/components/common/card';
import { useMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { getBuddyBossGroups, getUserGroups } from '@/services/wordpress-api';
import { jwtDecode } from 'jwt-decode';

interface RightPanelProps {
  onClose?: () => void;
}

export default function RightPanel({ onClose }: RightPanelProps) {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('wp_token');
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const currentUserId = decoded.data?.user?.id;

      if (!currentUserId) return;

      const loadGroups = async () => {
        try {
          const groups = await getUserGroups(currentUserId);
          console.log('Loaded groups:', groups);
          setGroups(groups);
        } catch (error) {
          console.error('Error loading groups:', error);
        }
      };

      loadGroups();
    } catch (err) {
      console.error('Token decode error:', err);
    }
  }, []);

  const isMobile = useMobile();
  const memberGroups = groups.filter(group => group.is_member);

  return (
    <div className="h-full overflow-y-auto p-4 bg-white dark:bg-background">
      {isMobile && (
        <div className="flex justify-end mb-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      )}

      <Card className="overflow-hidden bg-white dark:bg-card border-border">
        <CardContent className="p-0">
          {/* Currently Online Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center text-foreground">
              Currently Online
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-card rounded-md">
                    <AvatarImage
                      src={`/generic-placeholder-graphic.png?height=40&width=40`}
                      alt="Online user"
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">U{i}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-card"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-border" />

          {/* My Groups Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center text-foreground">
              My Groups
            </h3>
            <div className="space-y-3">
              {groups.map(group => (
                <a
                  key={group.id}
                  href={group.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-muted/40 transition-colors duration-150"
                >
                  <Avatar className="h-12 w-12 flex-shrink-0 rounded-md">
                    <AvatarImage
                      src={
                        group.avatar_urls?.full ||
                        `/generic-placeholder-graphic.png?height=40&width=40`
                      }
                      alt={group.name}
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">
                      {group.name?.[0] || 'G'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold truncate">{group.name}</div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {group.description?.raw || 'No description available.'}
                    </p>

                    <div className="text-xs text-gray-500 dark:text-muted-foreground mt-1 flex justify-between">
                      <span>{group.members_count} members</span>
                      {group.role && (
                        <span className="italic">
                          {group.role.charAt(0).toUpperCase() +
                            group.role.slice(1)}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Last active:{' '}
                      {new Date(group.last_activity).toLocaleDateString()}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-border" />

          {/* Suggested Connections */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center text-foreground">
              Suggested Connections
            </h3>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-muted/40 cursor-pointer"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0 rounded-md">
                    <AvatarImage
                      src={`/generic-placeholder-graphic.png?height=40&width=40`}
                      alt="Suggested connection"
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">S{i}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">User {i + 1}</div>
                    <div className="text-xs text-gray-500 dark:text-muted-foreground">
                      {Math.floor(Math.random() * 10) + 2} mutual connections
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex-shrink-0"
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
