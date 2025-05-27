import { useState } from 'react';

import { X } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import { Card, CardContent } from '@/components/common/card';
import { useMobile } from '@/hooks/use-mobile';

interface RightPanelProps {
  onClose?: () => void;
}

export default function RightPanel({ onClose }: RightPanelProps) {
  const isMobile = useMobile();
  const [connectionsTab, setConnectionsTab] = useState<'newest' | 'online'>(
    'newest',
  );

  // Mock data for profiles
  const profiles = Array.from({ length: 6 }).map((_, i) => ({
    id: `profile-${String(i + 1)}`,
    name: `User ${String(i + 1)}`,
    avatar: `/generic-placeholder-graphic.png?height=40&width=40`,
    fallback: `U${String(i + 1)}`,
  }));

  const recentMembers = Array.from({ length: 6 }).map((_, i) => ({
    id: `member-${String(i + 1)}`,
    name: `Member ${String(i + 1)}`,
    avatar: `/generic-placeholder-graphic.png?height=40&width=40`,
    fallback: `M${String(i + 1)}`,
  }));

  // Stable mock data for groups
  const groups = [
    { id: 'group-1', name: 'Group 1', members: 42 },
    { id: 'group-2', name: 'Group 2', members: 67 },
    { id: 'group-3', name: 'Group 3', members: 89 },
    { id: 'group-4', name: 'Group 4', members: 53 },
  ];

  return (
    <div className="h-full overflow-y-auto p-4  dark:bg-background">
      {!!isMobile && (
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
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
                <div
                  key={`online-user-${String(i + 1)}`}
                  className="relative"
                >
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-card rounded-md">
                    <AvatarImage
                      src="/generic-placeholder-graphic.png?height=40&width=40"
                      alt="Online user"
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">
                      U{String(i + 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-card" />
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
            <div className="space-y-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-muted/40 cursor-pointer"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0 rounded-md">
                    <AvatarImage
                      src="/generic-placeholder-graphic.png?height=40&width=40"
                      alt="Group"
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">
                      G{group.id.split('-')[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{group.name}</div>
                    <div className="text-xs text-gray-500 dark:text-muted-foreground">
                      {group.members} members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-border" />

          {/* My Connections Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center text-foreground">
              My Connections
            </h3>
            <div className="flex justify-center gap-2 mb-4">
              <Button
                variant={connectionsTab === 'newest' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => {
                  setConnectionsTab('newest');
                }}
                aria-pressed={connectionsTab === 'newest'}
              >
                Newest
              </Button>
              <Button
                variant={connectionsTab === 'online' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => {
                  setConnectionsTab('online');
                }}
                aria-pressed={connectionsTab === 'online'}
              >
                Online
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex flex-col items-center"
                >
                  <Avatar className="h-12 w-12 mb-1 rounded-md">
                    <AvatarImage
                      src={profile.avatar}
                      alt={profile.name}
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">
                      {profile.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center truncate w-full">
                    {profile.name}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
            >
              More
            </Button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-border" />

          {/* Recently Added Members Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center text-foreground">
              Recently Added Members
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {recentMembers.map((profile) => (
                <div
                  key={profile.id}
                  className="flex flex-col items-center"
                >
                  <Avatar className="h-12 w-12 mb-1 rounded-md">
                    <AvatarImage
                      src={profile.avatar}
                      alt={profile.name}
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">
                      {profile.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center truncate w-full">
                    {profile.name}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
            >
              More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
