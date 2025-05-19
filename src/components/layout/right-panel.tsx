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
            <h3 className="text-sm font-medium mb-3 text-center text-foreground">My Groups</h3>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-muted/40 cursor-pointer"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0 rounded-md">
                    <AvatarImage
                      src={`/generic-placeholder-graphic.png?height=40&width=40`}
                      alt="Group"
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">G{i}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">Group {i + 1}</div>
                    <div className="text-xs text-gray-500 dark:text-muted-foreground">
                      {Math.floor(Math.random() * 100) + 10} members
                    </div>
                  </div>
                </div>
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
