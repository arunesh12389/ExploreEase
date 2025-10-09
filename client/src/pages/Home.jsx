import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, Tag, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceCard } from '@/components/PlaceCard';
import { TrendingCard } from '@/components/TrendingCard';
import { OfferCard } from '@/components/OfferCard';
import { places as placesSchema, offers as offersSchema } from '@shared/schema.js'; 

export default function Home() {
  const { data: trendingPlaces, isLoading: loadingTrending } = useQuery({
    queryKey: ['/api/places/trending'],
  });

  const { data: featuredPlaces, isLoading: loadingFeatured } = useQuery({
    queryKey: ['/api/places/featured'],
  });

  const { data: offersList, isLoading: loadingOffers } = useQuery({
    queryKey: ['/api/offers'],
  });

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920"
            alt="VIT-AP Campus"
            className="w-full h-full object-cover"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Your Local Guide
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Explore attractions, services, and events around VIT-AP University
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/discover">
                <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90" data-testid="button-explore-places">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Places
                </Button>
            </Link>
            <Link href="/trip-planner">
                <Button size="lg" variant="outline" className="border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/30" data-testid="button-plan-trip">
                  Plan Your Trip
                </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { label: '500+ Places', icon: Search },
              { label: '10K+ Student Reviews', icon: TrendingUp },
              { label: 'Verified Rentals', icon: Car },
            ].map((stat, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-white" />
                  <p className="text-lg font-semibold text-white">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Weekly Top 5</h2>
              <p className="text-muted-foreground">Most visited by VIT-AP students this week</p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent" />
          </div>
          
          {loadingTrending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPlaces?.slice(0, 5).map((place, idx) => (
                <TrendingCard key={place.id} place={place} rank={idx + 1} />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Live Offers & Discounts</h2>
              <p className="text-muted-foreground">Limited time deals from local businesses</p>
            </div>
            <Tag className="h-8 w-8 text-accent" />
          </div>
          
          {loadingOffers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offersList?.slice(0, 6).map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
          
          {offersList && offersList.length > 6 && (
            <div className="text-center mt-8">
              <Link href="/offers">
              
                  <Button variant="outline" data-testid="button-view-all-offers">
                    View All Offers
                  </Button>
             
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-2">Featured Places</h2>
            <p className="text-muted-foreground">Top-rated attractions and services</p>
          </div>
          
          {loadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPlaces?.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-primary/80 to-primary/40 text-primary-foreground">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Need a Vehicle for Your Trip?</h2>
          <p className="text-lg mb-8 opacity-90">
            Browse verified vehicles from trusted owners. Bikes, cars, and vans available for rent.
          </p>
          <Link href="/vehicles">
         
              <Button size="lg" variant="" data-testid="button-browse-vehicles">
                <Car className="mr-2 h-5 w-5" />
                Rent Vehicles
              </Button>
     
          </Link>
        </div>
      </section>
    </div>
  );
}