import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Car, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VehicleCard } from '@/components/VehicleCard';
// Removed specific type imports, keeping runtime value imports
import { vehicleTypes } from '@shared/schema.js';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

export default function Vehicles() {
  const { isAuthenticated } = useAuth();
  // Removed type annotations from useState
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');

  // Removed generic type annotation from useQuery
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['/api/vehicles'],
  });

  const filteredVehicles = vehicles?.filter((vehicle) => {
    if (!vehicle.isAvailable || !vehicle.isVerified) return false;
    if (selectedType !== 'all' && vehicle.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const sortedVehicles = filteredVehicles?.sort((a, b) => {
    if (sortBy === 'price') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'capacity') return b.capacity - a.capacity;
    return 0;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Vehicle Rentals</h1>
            <p className="text-muted-foreground text-lg">
              Verified vehicles from trusted owners
            </p>
          </div>
          {isAuthenticated && (
            <Link href="/vehicles/add">
              <a>
                <Button data-testid="button-add-vehicle">
                  <Car className="mr-2 h-4 w-4" />
                  List Your Vehicle
                </Button>
              </a>
            </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-vehicles"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-vehicle-type">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vehicleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : sortedVehicles && sortedVehicles.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                Showing {sortedVehicles.length} {sortedVehicles.length === 1 ? 'vehicle' : 'vehicles'}
              </p>
            </div>
            <div className="space-y-6">
              {sortedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
