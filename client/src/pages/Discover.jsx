import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlaceCard } from '@/components/PlaceCard';
// Removed specific type imports, keeping runtime value imports
import { categories } from '@shared/schema.js';

export default function Discover() {
  // Removed type annotation for useState
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Removed generic type annotation from useQuery
  const { data: places, isLoading } = useQuery({
    queryKey: ['/api/places', selectedCategory, searchQuery, sortBy],
  });

  const filteredPlaces = places?.filter((place) => {
    if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;
    if (searchQuery && !place.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedPlaces = filteredPlaces?.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'student-rating') return b.studentRating - a.studentRating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    return 0;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Places</h1>
          <p className="text-muted-foreground text-lg">
            Explore attractions, restaurants, services, and more
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-places"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="student-rating">Student Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            data-testid="filter-all"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              data-testid={`filter-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : sortedPlaces && sortedPlaces.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                Showing {sortedPlaces.length} {sortedPlaces.length === 1 ? 'place' : 'places'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No places found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
