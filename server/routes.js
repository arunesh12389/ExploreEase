import { createServer } from "http";
// Updated import extension
import { storage } from "./storage.js";
import bcrypt from "bcryptjs";
// Imports from the shared schema, assuming @shared/schema.ts was renamed to @shared/schema.js
import {
  insertUserSchema,
  insertPlaceSchema,
  insertReviewSchema,
  insertVehicleSchema,
  insertOfferSchema,
  insertTripSchema,
} from "@shared/schema.js";

// TypeScript types (Express and Server) removed from function signature
export async function registerRoutes(app) {
  // Authentication Routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, name, isStudent } = insertUserSchema.extend({
        name: insertUserSchema.shape.name,
        isStudent: insertUserSchema.shape.isStudent.optional(),
      }).parse(req.body);

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        isStudent: isStudent || email.endsWith('@vitap.ac.in'),
        isAdmin: false,
      });

      // Remove password before sending response
      res.json({ ...user, password: undefined });
    } catch (error) {
      // Catch Zod validation errors and other errors
      res.status(400).json({ message: error.message || 'Signup failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      // No type validation applied here, assuming simple login payload
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Remove password before sending response
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ message: error.message || 'Login failed' });
    }
  });

  // Places Routes
  app.get('/api/places', async (_req, res) => {
    try {
      const places = await storage.getAllPlaces();
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/places/trending', async (_req, res) => {
    try {
      const places = await storage.getTrendingPlaces(5);
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/places/featured', async (_req, res) => {
    try {
      const places = await storage.getFeaturedPlaces(8);
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/places/:id', async (req, res) => {
    try {
      const place = await storage.getPlace(req.params.id);
      if (!place) {
        return res.status(404).json({ message: 'Place not found' });
      }
      res.json(place);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/places', async (req, res) => {
    try {
      const placeData = insertPlaceSchema.parse(req.body);
      const place = await storage.createPlace(placeData);
      res.status(201).json(place);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Reviews Routes
  app.get('/api/reviews/:placeId', async (req, res) => {
    try {
      const reviews = await storage.getReviewsByPlace(req.params.placeId);
      const reviewsWithUser = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            userName: user?.name || 'Anonymous',
            userAvatar: user?.avatar,
          };
        })
      );
      res.json(reviewsWithUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/reviews/:placeId', async (req, res) => {
    try {
      const userId = req.body.userId; // Assume userId is passed in the body for simplicity without proper session
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const reviewData = insertReviewSchema.omit({ placeId: true }).parse(req.body);
      const review = await storage.createReview(
        { ...reviewData, placeId: req.params.placeId },
        userId,
        user.isStudent
      );
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Vehicle Routes
  app.get('/api/vehicles', async (_req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/vehicles/:id', async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/vehicles', async (req, res) => {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Offers Routes
  app.get('/api/offers', async (_req, res) => {
    try {
      const offers = await storage.getActiveOffers();
      const offersWithPlace = await Promise.all(
        offers.map(async (offer) => {
          const place = await storage.getPlace(offer.placeId);
          return {
            ...offer,
            placeName: place?.name || 'Unknown',
          };
        })
      );
      res.json(offersWithPlace);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/offers', async (req, res) => {
    try {
      const offerData = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer(offerData);
      res.status(201).json(offer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Trip Routes
  app.get('/api/trips/:userId', async (req, res) => {
    try {
      const trips = await storage.getTripsByUser(req.params.userId);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/trips', async (req, res) => {
    try {
      const tripData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(tripData);
      res.status(201).json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin Routes
  app.get('/api/admin/vehicles/pending', async (_req, res) => {
    try {
      const vehicles = await storage.getPendingVehicles();
      const vehiclesWithOwner = await Promise.all(
        vehicles.map(async (vehicle) => {
          const owner = await storage.getUser(vehicle.ownerId);
          return {
            ...vehicle,
            ownerName: owner?.name || 'Unknown',
          };
        })
      );
      res.json(vehiclesWithOwner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/admin/vehicles/:vehicleId/verify', async (req, res) => {
    try {
      const { approve } = req.body;
      // 'approve' will be treated as boolean-like in JS if sent as JSON boolean
      await storage.updateVehicleVerification(req.params.vehicleId, approve);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
