import { Clock, MapPin, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Removed specific type import
// import { Offer } from '@shared/schema';

// Removed interface definition
// interface OfferCardProps {
//   offer: Offer & { placeName?: string };
// }

// Removed type annotation on parameter
export function OfferCard({ offer }) {
  const daysLeft = Math.ceil((new Date(offer.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 3;

  return (
    <Card className="hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-offer-${offer.id}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2">{offer.title}</h3>
              {offer.placeName && (
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{offer.placeName}</span>
                </div>
              )}
            </div>
            
            {(offer.discountPercentage || offer.discountAmount) && (
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {offer.discountPercentage ? `${offer.discountPercentage}%` : `₹${offer.discountAmount}`}
                    </div>
                    <div className="text-xs">OFF</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>

          {offer.code && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="font-mono">
                {offer.code}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={isExpiringSoon ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                {daysLeft > 0 ? `Expires in ${daysLeft} days` : 'Expired'}
              </span>
            </div>
            <Button variant="default" size="sm" data-testid={`button-redeem-${offer.id}`}>
              Redeem
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
