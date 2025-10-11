import { Link, useLocation } from 'wouter';
import { Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Define navigation links for clarity and easier mapping
const navLinks = [
  { href: '/discover', label: 'Explore' },
  { href: '/trip-planner', label: 'Trip Planning' },
  { href: '/vehicles', label: 'Rent Vehicles' },
  { href: '/offers', label: 'Offers' },
  { href: '/events', label: 'Events' },
  { href: '/myvit', label: 'MyVIT' },
];

export function Header() {
  const [location,setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      setLocation(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 md:h-20 items-center gap-4 px-4">
        <Link href="/">
          <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3" data-testid="link-home">
            <img 
              src="/logo.png"
              alt="ExploreEase Logo" 
              className="h-12 w-23"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/A855F7/FFFFFF?text=EE'; e.currentTarget.onerror = null; }}
            />
          </div>
        </Link>
        
        {/* NEW Navigation Links for larger screens */}
        <nav className="hidden lg:flex items-center gap-2 ml-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={`font-semibold ${location === link.href ? 'text-primary' : 'text-muted-foreground'}`}
                data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden md:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search places,cafes and more..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch} 
                data-testid="input-search"
              />
            </div>
          </div>

          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-user-menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {user?.isStudent && (
                      <Badge variant="secondary" className="mt-1 w-fit">
                        Student Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/trips">
                    <a className="w-full" data-testid="link-my-trips">My Trips</a>
                  </Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <a className="w-full" data-testid="link-admin">Admin Dashboard</a>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
                <Button variant="default" data-testid="button-login">
                  Sign In
                </Button>
            </Link>
          )}
        </div>
      </div>


    </header>
  );
}