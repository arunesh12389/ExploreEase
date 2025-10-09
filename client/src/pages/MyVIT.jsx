import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MessageSquare, CalendarPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';

// Chat Post Component
function PostCard({ post }) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-2 mb-2">
        <p className="font-semibold text-sm">{post.userName}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
      <p className="text-sm">{post.content}</p>
    </div>
  );
}


export default function MyVIT() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // State for Event Form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  
  // State for Chat
  const [postContent, setPostContent] = useState('');

  // Fetching community posts
  const { data: posts, isLoading: isLoadingPosts } = useQuery({ 
    queryKey: ['/api/posts'] 
  });

  // Mutation for creating an event
  const createEventMutation = useMutation({
    mutationFn: (eventData) => apiRequest('POST', '/api/events', eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ title: 'Event submitted successfully!' });
      setEventTitle(''); setEventDesc(''); setEventDate(''); setEventLocation('');
    },
    onError: (err) => toast({ title: 'Failed to submit event', description: err.message, variant: 'destructive' }),
  });

  // Mutation for creating a post
  const createPostMutation = useMutation({
    mutationFn: (postData) => apiRequest('POST', '/api/posts', postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setPostContent('');
    },
    onError: (err) => toast({ title: 'Failed to post message', description: err.message, variant: 'destructive' }),
  });

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast({ title: 'Please log in to submit an event', variant: 'destructive' });
    createEventMutation.mutate({
      title: eventTitle,
      description: eventDesc,
      date: eventDate,
      location: eventLocation,
      organizerId: user.id,
    });
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast({ title: 'Please log in to post', variant: 'destructive' });
    createPostMutation.mutate({ content: postContent, userId: user.id });
  };


  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">MyVIT Community Hub</h1>
          <p className="text-muted-foreground text-lg">
            Connect with the VIT-AP community, share events, and ask questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Event Submission */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarPlus /> List an Event</CardTitle>
                <CardDescription>Share your club or community event.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="event-desc">Description</Label>
                    <Textarea id="event-desc" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="event-date">Date</Label>
                    <Input id="event-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="event-location">Location</Label>
                    <Input id="event-location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="e.g., Academic Block" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={!isAuthenticated || createEventMutation.isPending}>
                    {createEventMutation.isPending ? 'Submitting...' : 'Submit Event'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Community Chat */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare /> Community Chat</CardTitle>
                <CardDescription>Ask for reviews, plan meetups, or discuss anything VIT-AP!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 border rounded-lg overflow-y-auto flex flex-col-reverse mb-4">
                  {isLoadingPosts ? (
                    <p className="text-center p-4">Loading posts...</p>
                  ) : (
                    posts?.map(post => <PostCard key={post.id} post={post} />)
                  )}
                </div>
                <form onSubmit={handlePostSubmit} className="flex items-center gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={!isAuthenticated}
                  />
                  <Button type="submit" disabled={!isAuthenticated || createPostMutation.isPending}>
                    Send
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}