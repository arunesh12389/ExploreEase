import { Link } from 'wouter';
import { Car, Users, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Removed specific type import
// import { Vehicle } from '@shared/schema';

// Removed interface definition
// interface VehicleCardProps {
//   vehicle: Vehicle;
// }

// Removed type annotation on parameter
export function VehicleCard({ vehicle }) {
  return (
    <Card className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-vehicle-${vehicle.id}`}>
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-3/5 aspect-video md:aspect-auto overflow-hidden">
          <img
            src={vehicle.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {vehicle.isVerified && (
            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground gap-1">
              <CheckCircle className="h-3 w-3" />
              Admin Verified
            </Badge>
          )}
        </div>
        
        <CardContent className="md:w-2/5 p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Car className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{vehicle.type}</Badge>
              </div>
              <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-sm text-muted-foreground">{vehicle.year}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{vehicle.capacity} seats</span>
              </div>
              {vehicle.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{vehicle.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{vehicle.description}</p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Price per day</p>
              <p className="text-xl font-mono font-bold text-accent">₹{vehicle.pricePerDay}</p>
            </div>
            <Link href={`/vehicle/${vehicle.id}`}>
              <a>
                <Button variant="default" data-testid={`button-book-${vehicle.id}`}>
                  Book Now
                </Button>
              </a>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
