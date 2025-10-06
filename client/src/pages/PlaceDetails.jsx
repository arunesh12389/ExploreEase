import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, Star, Phone, Globe, Navigation, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ReviewCard } from '@/components/ReviewCard';
import { MapplsMap } from '@/components/MapplsMap';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
// Removed specific type imports, keeping runtime value imports
import { useState } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function PlaceDetails() {
  // Removed generic type annotation from useParams
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  // Removed type annotations from useState
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  // Removed explicit type annotations from useState
  const [reviewTab, setReviewTab] = useState('all');

  // Removed generic type annotation from useQuery
  const { data: place, isLoading } = useQuery({
    queryKey: [`/api/places/${id}`],
  });

  // Removed generic type annotation from useQuery
  const { data: reviews } = useQuery({
    queryKey: [`/api/reviews/${id}`],
  });

  const createReviewMutation = useMutation({
    // Removed type annotation from function parameter
    mutationFn: async (data) => {
      // Removed non-null assertion on user
      return apiRequest('POST', `/api/reviews/${id}`, { ...data, userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/places/${id}`] });
      setComment('');
      setRating(5);
      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback.',
      });
    },
    // Removed type assertion for error
    onError: (error) => {
      toast({
        title: 'Failed to submit review',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      toast({
        title: 'Please write a review',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    createReviewMutation.mutate({ rating, comment });
  };

  const filteredReviews = reviewTab === 'students' 
    ? reviews?.filter(r => r.isStudentReview)
    : reviews;

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 container px-4">
        <div className="h-96 bg-muted animate-pulse rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Place not found</h2>
          <p className="text-muted-foreground">This place doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <div className="mb-8 overflow-hidden rounded-2xl">
          <div className="relative h-[400px]">
            <img
              src={place.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920'}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 backdrop-blur-sm border-white/40">
                  {place.category}
                </Badge>
                {place.studentReviewCount > 0 && (
                  <Badge className="bg-secondary text-secondary-foreground gap-1">
                    <Shield className="h-3 w-3" />
                    Student Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{place.rating.toFixed(1)}</span>
                  <span className="opacity-90">({place.reviewCount} reviews)</span>
                </div>
                {place.priceRange && (
                  <span className="font-mono">{place.priceRange}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{place.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                
                {/* Removed type casting in onValueChange */}
                <Tabs value={reviewTab} onValueChange={(v) => setReviewTab(v)}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="all" data-testid="tab-all-reviews">
                      All Reviews ({place.reviewCount})
                    </TabsTrigger>
                    <TabsTrigger value="students" data-testid="tab-student-reviews">
                      Student Reviews ({place.studentReviewCount})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={reviewTab} className="space-y-4">
                    {isAuthenticated && (
                      <Card className="bg-muted/30">
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-4">Write a Review</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Rating</label>
                              <div className="flex gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setRating(i + 1)}
                                    className="transition-transform hover:scale-110"
                                    data-testid={`star-${i + 1}`}
                                  >
                                    <Star
                                      className={`h-8 w-8 ${
                                        i < rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Your Review</label>
                              <Textarea
                                placeholder="Share your experience..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                data-testid="textarea-review"
                              />
                            </div>
                            <Button
                              onClick={handleSubmitReview}
                              disabled={createReviewMutation.isPending}
                              data-testid="button-submit-review"
                            >
                              {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {filteredReviews && filteredReviews.length > 0 ? (
                      <div className="space-y-4">
                        {filteredReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No reviews yet. Be the first to review!
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Location</h3>
                  <div className="flex items-start gap-2 text-muted-foreground mb-4">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{place.address}</p>
                  </div>
                  <MapplsMap latitude={place.latitude} longitude={place.longitude} height="300px" />
                </div>

                {place.phone && (
                  <div>
                    <h3 className="font-semibold mb-3">Contact</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{place.phone}</p>
                    </div>
                  </div>
                )}

                {place.website && (
                  <div>
                    <h3 className="font-semibold mb-3">Website</h3>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                <Button className="w-full" variant="default" data-testid="button-get-directions">
                  <Navigation className="mr-2 h-4 w-4" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {place.studentRating > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-secondary" />
                    <h3 className="font-semibold">Student Rating</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-3xl font-bold">{place.studentRating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on {place.studentReviewCount} verified student reviews
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
