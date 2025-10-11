import { Star, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function ReviewCard({ review }) {
  const userName = review.userId ? review.userId.name : 'Anonymous';
  
  // --- FIX IS HERE ---
  // We use the `userName` variable we just created, not `review.userName`.
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const isStudent = review.userId && review.userId.isStudent;

  return (
    <Card className="hover-elevate transition-all duration-300" data-testid={`card-review-${review.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className={isStudent ? 'ring-2 ring-primary' : ''}>
            <AvatarFallback className={isStudent ? 'bg-primary/10' : ''}>
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{userName}</p>
                {isStudent && (
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Student Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed">{review.comment}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {review.images.slice(0, 3).map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Review ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}