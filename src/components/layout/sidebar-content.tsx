// @ts-jsx
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import { Card, CardContent, CardTitle } from '@/components/common/card';
import { Gift, Calendar, ExternalLink, Play, BookOpen } from 'lucide-react';

export default function SidebarContent() {
  // Mock data for birthdays
  const birthdays = [
    {
      id: 'b1',
      name: 'Michael Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 'b2',
      name: 'Sarah Williams',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Sponsored Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center">
              The Comforter's Stream
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 text-center">
                  DVD of the Week
                </h4>
                <div className="relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50"
                    >
                      <Play className="h-6 w-6" />
                      <span className="sr-only">Play video</span>
                    </Button>
                  </div>
                  <div className="w-full h-full opacity-70 bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* DOZEI Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center justify-center">
              <BookOpen className="h-4 w-4 mr-2 text-gray-900 dark:text-white" />
              DOZEI
            </h3>
            <div className="space-y-3">
              <Card className="shadow-sm overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-800 h-28 flex items-center justify-center">
                  <BookOpen className="h-10 w-10" />
                </div>
                <CardContent className="p-3 pt-2 pb-2 text-center">
                  <CardTitle className="text-sm font-medium mb-1">
                    Mary Mother of God
                  </CardTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Level 1
                  </p>

                  <Button className="w-full h-8 text-xs" variant="outline">
                    View Curriculum
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* ICGJC Store Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center">
              ICGJC Store
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 text-center">
                <div className="text-sm font-medium mb-1">New Arrivals</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Check out our latest books and resources for spiritual growth
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 text-center">
                <div className="text-sm font-medium mb-1">Weekly Specials</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  15% off all devotional materials this week only
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 text-center">
                <div className="text-sm font-medium mb-1">Gift Sets</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Curated scripture journals, bookmarks, and prayer cards
                </p>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs">
                Visit Store
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
