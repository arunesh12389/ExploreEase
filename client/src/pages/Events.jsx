import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function EventCard({ event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          Organized by: {event.organizerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline">Location: {event.location}</Badge>
          <span className="font-semibold">
            Date: {new Date(event.date).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Events() {
  const { data: events, isLoading } = useQuery({ queryKey: ['/api/events'] });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upcoming Events</h1>
          <p className="text-muted-foreground text-lg">
            Find out what's happening in and around VIT-AP.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">
              Check back soon or list your own event on the MyVIT page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}