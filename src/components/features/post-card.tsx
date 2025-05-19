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
    <Card className="border border-gray-200 dark:border-gray-800">
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
            <div className="font-semibold">{post.user.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
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
        <p className="text-sm sm:text-base">{post.content}</p>
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
              className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`}
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
