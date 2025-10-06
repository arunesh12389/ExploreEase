import { Link } from 'wouter';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
// Removed specific type import
// import { Place } from '@shared/schema';

// Removed interface definition
// interface TrendingCardProps {
//   place: Place;
//   rank: number;
// }

// Removed type annotation on parameter
export function TrendingCard({ place, rank }) {
  return (
    <Link href={`/place/${place.id}`}>
      <a data-testid={`card-trending-${rank}`}>
        <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 relative">
          <div className="absolute top-4 left-4 z-10">
            <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold shadow-lg">
              {rank}
            </div>
          </div>
          
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={place.images[0] || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200'}
              alt={place.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="font-bold text-xl mb-2">{place.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>{place.studentVisitCount} student visits this week</span>
              </div>
              <p className="text-sm mt-2 line-clamp-2 text-white/90">{place.description}</p>
            </CardContent>
          </div>
        </Card>
      </a>
    </Link>
  );
}
