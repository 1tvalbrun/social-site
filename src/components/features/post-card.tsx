import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/common/card';
import { Heart, MessageCircle, Flag, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';

interface PostProps {
  post: {
    id: string;
    user: {
      name: string;
      username: string;
      avatar: string;
    };
    timestamp: string;
    content: string;
    likes: number;
    comments: number;
  };
}

export default function PostCard({ post }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card className="border border-gray-200 dark:border-border bg-white dark:bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={post.user.avatar || '/placeholder.svg'}
              alt={post.user.name}
            />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              {post.user.name}
              {post.user.name === 'Jamie Chen' && (
                <span className="bg-gray-900 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-1 dark:bg-gray-100 dark:text-gray-900">
                  Minor
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-muted-foreground">
              @{post.user.username} · {post.timestamp}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Flag className="mr-2 h-4 w-4" />
              <span>Report post</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm sm:text-base text-foreground">{post.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${liked ? 'fill-primary text-primary dark:fill-primary/90 dark:text-primary/90' : ''}`}
            />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
