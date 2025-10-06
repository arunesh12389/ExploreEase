import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle, XCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: pendingVehicles, isLoading } = useQuery({
    queryKey: ['/api/admin/vehicles/pending'],
  });

  const verifyVehicleMutation = useMutation({
    mutationFn: async ({ vehicleId, approve }) => {
      return apiRequest('POST', `/api/admin/vehicles/${vehicleId}/verify`, { approve });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vehicles/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      toast({
        title: 'Vehicle updated',
        description: 'Vehicle verification status updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update vehicle',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (!user?.isAdmin) {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage vehicle verifications and platform content
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Vehicle Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : pendingVehicles && pendingVehicles.length > 0 ? (
              <div className="space-y-4">
                {pendingVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="hover-elevate">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={vehicle.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {vehicle.brand} {vehicle.model} ({vehicle.year})
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Owner: {vehicle.ownerName}
                              </p>
                            </div>
                            <Badge variant="outline">{vehicle.type}</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {vehicle.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">Capacity: {vehicle.capacity}</Badge>
                            <Badge variant="outline">₹{vehicle.pricePerDay}/day</Badge>
                            <Badge variant="outline">{vehicle.location}</Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => verifyVehicleMutation.mutate({ vehicleId: vehicle.id, approve: true })}
                              disabled={verifyVehicleMutation.isPending}
                              data-testid={`button-approve-${vehicle.id}`}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => verifyVehicleMutation.mutate({ vehicleId: vehicle.id, approve: false })}
                              disabled={verifyVehicleMutation.isPending}
                              data-testid={`button-reject-${vehicle.id}`}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  No pending vehicle verifications at the moment
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
