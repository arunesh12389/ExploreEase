import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip.jsx';
import { ThemeProvider } from '@/contexts/ThemeProvider.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { Header } from '@/components/Header';
import Home from '@/pages/Home.jsx';
import Discover from '@/pages/Discover.jsx';
import PlaceDetails from '@/pages/PlaceDetails.jsx';
import TripPlanner from '@/pages/TripPlanner.jsx';
import Vehicles from '@/pages/Vehicles.jsx';
import Admin from '@/pages/Admin.jsx';
import Auth from '@/pages/Auth.jsx';
import NotFound from '@/pages/not-found.jsx';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/place/:id" component={PlaceDetails} />
      <Route path="/trip-planner" component={TripPlanner} />
      <Route path="/vehicles" component={Vehicles} />
      <Route path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Header />
              <Router />
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
