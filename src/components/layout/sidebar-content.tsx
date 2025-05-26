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

  const thumbnailUrl =
    'https://alpha.uscreencdn.com/images/programs/434108/horizontal/nothing-to-worry-about.1693093184.png?auto=webp&width=350';
  const videoUrl = 'https://thecomforterstream.tv/catalog';

  function handleVideoClick(url: string) {
    window.open(url, '_blank'); // or open in modal/player
  }

  const shopItems = [
    {
      title: 'New Arrivals',
      description:
        'Check out our latest books and resources for spiritual growth',
      image:
        'https://icgjc.com/store/wp-content/uploads/sites/4/2021/09/canvas-in-12x12-wall-613bde3c2fbd7-247x296.jpg',
      url: 'https://yoursite.com/shop/new-arrivals',
    },
    {
      title: 'Weekly Specials',
      description: '15% off all devotional materials this week only',
      image:
        'https://icgjc.com/store/wp-content/uploads/sites/4/2025/01/all-over-print-recycled-unisex-basketball-jersey-white-front-678cb3c5efab2-247x296.jpg',
      url: 'https://yoursite.com/shop/specials',
    },
    {
      title: 'Gift Sets',
      description: 'Curated scripture journals, bookmarks, and prayer cards',
      image:
        'https://icgjc.com/store/wp-content/uploads/sites/4/2021/07/organic-cotton-kids-t-shirt-black-right-front-60e077912bfea-247x296.jpg',
      url: 'https://yoursite.com/shop/gift-sets',
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Sponsored Section */}
      <Card className="overflow-hidden bg-white dark:bg-card border-border">
        <CardContent className="p-0">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center text-foreground">
              The Comforter's Stream
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-muted-foreground text-center">
                  DVD of the Week
                </h4>
                <div className="relative rounded-md overflow-hidden bg-gray-100 dark:bg-muted aspect-video ">
                  <div className="">
                    <div
                      onClick={() => handleVideoClick(videoUrl)}
                      className="relative cursor-pointer w-full max-w-md mx-auto"
                    >
                      <img
                        src={thumbnailUrl}
                        alt="Video thumbnail"
                        className="w-full h-auto rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-80 rounded-full p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-5.197-3.02A1 1 0 008 9.02v5.96a1 1 0 001.555.832l5.197-3.02a1 1 0 000-1.664z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full opacity-0 bg-gray-200 dark:bg-muted"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-border" />

          {/* DOZEI Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center justify-center text-foreground">
              <BookOpen className="h-4 w-4 mr-2" />
              DOZEI
            </h3>
            <div className="space-y-3">
              <Card className="shadow-sm overflow-hidden border-border">
                <div className="bg-gray-100 dark:bg-muted h-28 flex items-center justify-center">
                  <BookOpen className="h-10 w-10" />
                </div>
                <CardContent className="p-3 pt-2 pb-2 text-center">
                  <CardTitle className="text-sm font-medium mb-1">
                    Mary Mother of God
                  </CardTitle>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground mb-2">
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
          <div className="h-px bg-gray-200 dark:bg-border" />

          {/* ICGJC Store Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3 text-center text-foreground">
              ICGJC Store
            </h3>
            <div className="flex flex-col space-y-4">
              {shopItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => window.open(item.url, '_blank')}
                  className="bg-gray-100 dark:bg-muted rounded-md p-3 text-center cursor-pointer hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <div className="text-sm font-medium mb-1">{item.title}</div>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() =>
                  window.open('https://icgjc.com/store/', '_blank')
                }
              >
                Visit Store
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
