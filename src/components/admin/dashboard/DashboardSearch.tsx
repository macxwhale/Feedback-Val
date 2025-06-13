
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Users, 
  MessageSquare, 
  Settings,
  Activity,
  X,
  Command
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'member' | 'question' | 'session' | 'setting';
  description: string;
  url?: string;
}

interface DashboardSearchProps {
  organizationId: string;
  onNavigate?: (url: string) => void;
}

export const DashboardSearch: React.FC<DashboardSearchProps> = ({ 
  organizationId, 
  onNavigate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results - in real implementation, this would query your data
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'John Doe',
      type: 'member',
      description: 'Admin member since 2023',
      url: '/admin/members'
    },
    {
      id: '2',
      title: 'How would you rate our service?',
      type: 'question',
      description: 'Rating question • 145 responses',
      url: '/admin/questions'
    },
    {
      id: '3',
      title: 'Session #abc123',
      type: 'session',
      description: 'Completed 2 hours ago • Score: 4.5/5',
      url: '/admin/feedback'
    },
    {
      id: '4',
      title: 'Organization Settings',
      type: 'setting',
      description: 'Manage organization preferences',
      url: '/admin/settings'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'member':
        return Users;
      case 'question':
        return MessageSquare;
      case 'session':
        return Activity;
      case 'setting':
        return Settings;
      default:
        return Search;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'member':
        return 'bg-blue-50 text-blue-700';
      case 'question':
        return 'bg-green-50 text-green-700';
      case 'session':
        return 'bg-purple-50 text-purple-700';
      case 'setting':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Open search with Cmd/Ctrl + K
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      // Close search with Escape
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }

      // Navigate results with arrow keys
      if (isOpen) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        }
        if (event.key === 'Enter' && results[selectedIndex]) {
          event.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (query.length > 0) {
      // Simulate search - filter mock results
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelectResult = (result: SearchResult) => {
    if (result.url && onNavigate) {
      onNavigate(result.url);
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full max-w-md flex items-center justify-between text-muted-foreground"
      >
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4" />
          <span>Search dashboard...</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <Command className="w-3 h-3" />
            K
          </kbd>
        </div>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-start justify-center pt-20">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-0">
            <div className="flex items-center border-b px-4">
              <Search className="w-4 h-4 text-muted-foreground mr-3" />
              <Input
                ref={inputRef}
                placeholder="Search members, questions, sessions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 shadow-none"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {results.length > 0 && (
              <div className="max-h-96 overflow-y-auto p-2">
                {results.map((result, index) => {
                  const Icon = getIcon(result.type);
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-muted transition-colors ${
                        index === selectedIndex ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                      </div>
                      <Badge variant="outline" className={getTypeColor(result.type)}>
                        {result.type}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            )}

            {query.length > 0 && results.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            )}

            {query.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start typing to search your dashboard</p>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px]">↵</kbd>
                    <span>to select</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd>
                    <span>to navigate</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px]">esc</kbd>
                    <span>to close</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
