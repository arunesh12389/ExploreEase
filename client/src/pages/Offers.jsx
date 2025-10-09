import { useQuery } from '@tanstack/react-query';
import { Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

// A simple card to display offer details
function OfferCard({ offer }) {
  return (
    <Link href={`/place/${offer.placeId}`}>
      <a className="block">
        <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{offer.title}</CardTitle>
              <Badge variant="secondary">{offer.discount}</Badge>
            </div>
            <CardDescription>At {offer.placeName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{offer.description}</p>
            <p className="text-xs text-muted-foreground mt-4">
              Valid until: {new Date(offer.validUntil).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}

export default function Offers() {
  const { data: offers, isLoading } = useQuery({ queryKey: ['/api/offers'] });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Offers & Deals</h1>
          <p className="text-muted-foreground text-lg">
            Exclusive discounts from local businesses.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No active offers</h3>
            <p className="text-muted-foreground">
              Check back later for new deals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}