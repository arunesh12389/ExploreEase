import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Calendar, Users, Car, DollarSign, MapPin, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { vehicleTypes } from '@shared/constants'; 

export default function TripPlanner() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupSize, setGroupSize] = useState('1');
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState('Bike'); // 2. ADD new state for vehicle

  const { data: places } = useQuery({
    queryKey: ['/api/places'],
  });

  const createTripMutation = useMutation({
    mutationFn: async (tripData) => {
      return apiRequest('POST', '/api/trips', tripData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      toast({
        title: 'Trip created successfully!',
        description: 'Your trip has been saved.',
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Failed to create trip',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setTripName('');
    setStartDate('');
    setEndDate('');
    setGroupSize('1');
    setSelectedPlaces([]);
    setCurrentDay(1);
    setSelectedVehicle('Bike');
  };

  const addPlace = (place) => {
    if (selectedPlaces.find(p => p.id === place.id)) {
      toast({
        title: 'Place already added',
        description: 'This place is already in your trip',
        variant: 'destructive',
      });
      return;
    }
    setSelectedPlaces([...selectedPlaces, { id: place.id, name: place.name, day: currentDay }]);
  };

  const removePlace = (placeId) => {
    setSelectedPlaces(selectedPlaces.filter(p => p.id !== placeId));
  };

  const calculateEstimate = () => {
    const days = startDate && endDate 
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 1;
    const size = parseInt(groupSize);
    
    const basePerPerson = 500;
    const foodCost = days * 300 * size;
    const transportCost = selectedPlaces.length * 100 * (size > 4 ? 2 : 1);
    const totalCost = basePerPerson * size + foodCost + transportCost;

    return {
      estimatedCost: totalCost,
      totalDistance: selectedPlaces.length * 5,
      breakdown: {
        base: basePerPerson * size,
        food: foodCost,
        transport: transportCost,
      }
    };
  };

  const handleCreateTrip = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to create trips',
        variant: 'destructive',
      });
      return;
    }

    if (!tripName || !startDate || !endDate || selectedPlaces.length === 0) {
      toast({
        title: 'Incomplete information',
        description: 'Please fill all fields and add at least one place',
        variant: 'destructive',
      });
      return;
    }

    const estimate = calculateEstimate();
    createTripMutation.mutate({
      userId: user.id,
      name: tripName,
      startDate: startDate, // Send as string, backend will handle it
      endDate: endDate,     // Send as string, backend will handle it
      groupSize: parseInt(groupSize),
      places: selectedPlaces,
      estimatedCost: estimate.estimatedCost,
      suggestedVehicle: selectedVehicle, // 4. SEND the selected vehicle
      totalDistance: estimate.totalDistance,
    });
  };

  const estimate = calculateEstimate();
  const days = startDate && endDate 
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Plan Your Trip</h1>
          <p className="text-muted-foreground text-lg">
            Create your perfect itinerary with cost estimates and vehicle suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tripName">Trip Name</Label>
                    <Input
                      id="tripName"
                      placeholder="e.g., Weekend Getaway"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      data-testid="input-trip-name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="startDate"
                          type="date"
                          className="pl-10"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          data-testid="input-start-date"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="endDate"
                          type="date"
                          className="pl-10"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          data-testid="input-end-date"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="groupSize">Group Size</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="groupSize"
                        type="number"
                        min="1"
                        max="20"
                        className="pl-10"
                        value={groupSize}
                        onChange={(e) => setGroupSize(e.target.value)}
                        data-testid="input-group-size"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Select Places</h3>
                  <Select value={currentDay.toString()} onValueChange={(v) => setCurrentDay(parseInt(v))}>
                    <SelectTrigger className="w-32" data-testid="select-day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: days > 0 ? days : 1 }).map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Day {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 mb-6">
                  <Label>Choose from popular places</Label>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {places?.slice(0, 10).map((place) => (
                      <div
                        key={place.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover-elevate cursor-pointer"
                        onClick={() => addPlace(place)}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{place.name}</p>
                          <p className="text-sm text-muted-foreground">{place.category}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            addPlace(place);
                          }}
                          data-testid={`button-add-${place.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPlaces.length > 0 && (
                  <div className="space-y-3">
                    <Label>Selected Places</Label>
                    <div className="space-y-2">
                      {selectedPlaces.map((place) => (
                        <div
                          key={place.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Day {place.day}</Badge>
                            <span className="font-medium">{place.name}</span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removePlace(place.id)}
                            data-testid={`button-remove-${place.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Cost Estimate</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Cost</span>
                      <span className="font-mono">₹{estimate.breakdown.base}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Food</span>
                      <span className="font-mono">₹{estimate.breakdown.food}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transport</span>
                      <span className="font-mono">₹{estimate.breakdown.transport}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Estimate</span>
                        <span className="text-2xl font-mono font-bold text-primary">
                          ₹{estimate.estimatedCost}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. REPLACE static text with a Select dropdown */}
                <div className="pt-4 border-t">
                  <Label htmlFor="vehicle-select" className="font-semibold mb-3 flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Select Vehicle
                  </Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger id="vehicle-select" className="w-full">
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Total Distance: ~{estimate.totalDistance} km</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreateTrip}
                  disabled={createTripMutation.isPending || !isAuthenticated}
                  data-testid="button-create-trip"
                >
                  {createTripMutation.isPending ? 'Creating...' : 'Create Trip'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}