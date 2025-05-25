import { useState, useEffect, useRef } from 'react';
import { X, SearchIcon } from 'lucide-react';
import { Input } from '@/components/common/input';
import { Button } from '@/components/common/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Mock search results
  const searchResults = [
    {
      id: 'user1',
      type: 'user',
      name: 'Alex Johnson',
      username: 'alexj',
      avatar: '/placeholder.svg?height=40&width=40',
      description: 'UX Designer | Coffee Enthusiast',
    },
    {
      id: 'user2',
      type: 'user',
      name: 'Taylor Swift',
      username: 'taylorswift',
      avatar: '/placeholder.svg?height=40&width=40',
      description: 'Singer-songwriter',
    },
    {
      id: 'group1',
      type: 'group',
      name: 'UI/UX Designers',
      avatar: '/placeholder.svg?height=40&width=40',
      description: 'A community for UI/UX designers',
    },
    {
      id: 'post1',
      type: 'post',
      content: 'Just launched my new portfolio website!',
      user: 'Alex Johnson',
    },
  ];

  // Filter results based on query
  const filteredResults =
    query.length > 0
      ? searchResults.filter(
          result =>
            result?.name?.toLowerCase().includes(query.toLowerCase()) ||
            result?.description?.toLowerCase().includes(query.toLowerCase()) ||
            result?.content?.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop that darkens the entire page */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Search container - positioned at the top */}
      <div className="relative w-full max-w-3xl mx-auto mt-16">
        <div className="bg-white dark:bg-card rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-border">
          <div className="p-4 border-b border-gray-200 dark:border-border flex items-center">
            <SearchIcon className="h-5 w-5 text-gray-500 dark:text-muted-foreground mr-2" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search for people, groups, or posts..."
              className="flex-1 border-0 dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:placeholder:text-muted-foreground/70"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {query.length > 0 && (
              <>
                {filteredResults.length > 0 ? (
                  <div className="p-2 space-y-2">
                    {filteredResults.map(result => (
                      <div
                        key={result.id}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-muted/40 rounded-md cursor-pointer"
                      >
                        {result.type !== 'post' ? (
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage
                                src={result.avatar || '/placeholder.svg'}
                                alt={result.name || ''}
                              />
                              <AvatarFallback>
                                {(result.name || '?').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">{result.name}</div>
                              <div className="text-sm text-gray-500 dark:text-muted-foreground">
                                {result.type === 'user'
                                  ? `@${result.username}`
                                  : result.description}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              Post by {result.user}
                            </div>
                            <div className="text-foreground">{result.content}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-muted-foreground">
                    No results found for "{query}"
                  </div>
                )}
              </>
            )}

            {query.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-muted-foreground">
                Start typing to search...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
