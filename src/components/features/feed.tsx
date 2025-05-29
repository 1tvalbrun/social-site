'use client';

import { useState, useEffect, useCallback } from 'react';
import PostCard from '@/components/features/post-card';
import CreatePostCard from '@/components/features/create-post-card';
import { Loader2 } from 'lucide-react';

import CreatePostCard from '@/components/features/create-post-card';
import PostCard from '@/components/features/post-card';

// Sample post data
const initialPosts = [
  {
    id: '1',
    user: {
      name: 'Alex Johnson',
      username: 'alexj',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    timestamp: '2 hours ago',
    content:
      'Just finished a great book on design systems. Highly recommend it for anyone interested in creating consistent UI experiences!',
    likes: 24,
    comments: 5,
  },
  {
    id: '2',
    user: {
      name: 'Sam Wilson',
      username: 'samw',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    timestamp: '4 hours ago',
    content:
      'Working on a new project using Next.js and Tailwind CSS. The developer experience is amazing! What are your favorite tech stacks these days?',
    likes: 42,
    comments: 12,
  },
  {
    id: '3',
    user: {
      name: 'Taylor Swift',
      username: 'taylorswift',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    timestamp: 'Yesterday',
    content:
      "Just announced new tour dates! Can't wait to see you all there. Check my website for more details and ticket information.",
    likes: 1024,
    comments: 256,
  },
  {
    id: '4',
    user: {
      name: 'Jamie Chen',
      username: 'jamiec',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    timestamp: '2 days ago',
    content:
      'Beautiful sunset at the beach today. Sometimes you need to take a break and appreciate the simple things in life. #sunset #mindfulness',
    likes: 76,
    comments: 8,
  },
];

export default function Feed() {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  // Handle new post submission
  const handlePostSubmit = (content: string) => {
    const newPost = {
      id: `post-${String(Date.now())}`,
      user: {
        name: 'Jane Doe',
        username: 'janedoe',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      timestamp: 'Just now',
      content,
      likes: 0,
      comments: 0,
    };

    // Add the new post to the beginning of the posts array
    setPosts([newPost, ...posts]);
  };

  // Simulate infinite scroll
  const loadMorePosts = useCallback(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setPosts(currentPosts => [
        ...currentPosts,
        {
          id: `new-${Date.now()}`,
          user: {
            name: 'New User',
            username: 'newuser',
            avatar: '/placeholder.svg?height=40&width=40',
          },
          timestamp: 'Just now',
          content:
            'This is a newly loaded post as you scroll down. In a real app, this would come from an API.',
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Detect when user scrolls to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadMorePosts]);

  return (
    <div className="py-4">
      {/* Create Post Card */}
      <CreatePostCard onPostSubmit={handlePostSubmit} />

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}

        {!!loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
