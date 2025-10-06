import { Link } from 'wouter';
import { MapPin, Star, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Removed specific type import
// import { Place } from '@shared/schema';

// Removed interface definition
// interface PlaceCardProps {
//   place: Place;
// }

// Removed type annotation on parameter
export function PlaceCard({ place }) {
  const hasStudentReviews = place.studentReviewCount > 0;
  const displayRating = hasStudentReviews ? place.studentRating : place.rating;
  const displayReviewCount = hasStudentReviews ? place.studentReviewCount : place.reviewCount;

  return (
    <Link href={`/place/${place.id}`}>
      <a data-testid={`card-place-${place.id}`}>
        <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-300">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={place.images[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'}
              alt={place.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              {hasStudentReviews && (
                <Badge className="bg-secondary text-secondary-foreground">
                  Student Verified
                </Badge>
              )}
              {place.visitCount > 100 && (
                <Badge className="bg-accent text-accent-foreground">
                  Trending
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg line-clamp-1">{place.name}</h3>
                {place.priceRange && (
                  <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                    {place.priceRange}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {place.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{displayRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({displayReviewCount})
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  <span>2.3 km</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
