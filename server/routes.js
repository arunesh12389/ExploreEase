import { createServer } from 'http';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import mongoose from 'mongoose';


// Import all Mongoose models
import { User } from '../models/user.model.js';
import { Place } from '../models/place.model.js';
import { Review } from '../models/review.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Offer } from '../models/offer.model.js';
import { Trip } from '../models/trip.model.js';
import { Event } from '../models/event.model.js';
import { Post } from '../models/post.model.js';

// --- Zod Schemas for Request Body Validation ---
const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
});

const reviewSchema = z.object({
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
});

// --- Helper function to recalculate Place ratings ---
export async function updatePlaceRatings(placeId) {
    const reviews = await Review.find({ placeId });
    if (reviews.length === 0) {
        await Place.findByIdAndUpdate(placeId, {
            rating: 0, studentRating: 0, reviewCount: 0, studentReviewCount: 0
        });
        return;
    }

    const allRatings = reviews.map(r => r.rating);
    const studentReviews = reviews.filter(r => r.isStudentReview);
    const studentRatings = studentReviews.map(r => r.rating);

    const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
    const avgStudentRating = studentRatings.length > 0 ? studentRatings.reduce((a, b) => a + b, 0) / studentRatings.length : 0;

    await Place.findByIdAndUpdate(placeId, {
        rating: avgRating.toFixed(2),
        studentRating: avgStudentRating.toFixed(2),
        reviewCount: allRatings.length,
        studentReviewCount: studentRatings.length,
    });
}


export async function registerRoutes(app) {
  // --- Authentication Routes ---
  app.post('/api/auth/signup', async (req, res, next) => {
    try {
      const { email, password, name } = userAuthSchema.parse(req.body);
      if (!name) throw new Error('Name is required for signup');
      
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword, name, isStudent: email.endsWith('@vitap.ac.in') });
      
      const userObject = user.toObject();
      delete userObject.password;
      res.status(201).json(userObject);
    } catch (error) { next(error); }
  });

  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const { email, password } = userAuthSchema.omit({ name: true }).parse(req.body);
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const userObject = user.toObject();
      delete userObject.password;
      res.json(userObject);
    } catch (error) { next(error); }
  });

  // --- Places Routes ---
  app.get('/api/places', async (req, res, next) => {
    try {
      const { category, sort, q } = req.query;
      let query = {};

      if (category && category !== 'all') {
        query.category = category;
      }
      if (q) {
        query.name = { $regex: q, $options: 'i' }; // Case-insensitive search
      }
      
      let sortOption = {};
      if (sort === 'top-rated') {
        sortOption = { rating: -1 };
      } else if (sort === 'student-rated') {
        sortOption = { studentRating: -1 };
      } else {
        sortOption = { createdAt: -1 }; // Default sort
      }

      const places = await Place.find(query).sort(sortOption);
      res.json(places);
    } catch (error) { next(error); }
  });

  app.get('/api/places/trending', async (req, res, next) => {
    try {
      const places = await Place.find().sort({ studentVisitCount: -1 }).limit(5);
      res.json(places);
    } catch (error) { next(error); }
  });

  app.get('/api/places/featured', async (req, res, next) => {
    try {
      const places = await Place.find().sort({ rating: -1 }).limit(8);
      res.json(places);
    } catch (error) { next(error); }
  });

  app.get('/api/places/:id', async (req, res, next) => {
    try {
      const place = await Place.findById(req.params.id);
      if (!place) return res.status(404).json({ message: 'Place not found' });
      
      // Increment visit count when a place is viewed
      const { isStudent } = req.query;
      const update = { $inc: { visitCount: 1 } };
      if (isStudent === 'true') {
        update.$inc.studentVisitCount = 1;
      }
      await Place.findByIdAndUpdate(req.params.id, update);

      res.json(place);
    } catch (error) { next(error); }
  });
  
  // --- Reviews Routes ---
  app.get('/api/reviews/:placeId', async (req, res, next) => {
    try {
      const reviews = await Review.find({ placeId: req.params.placeId })
        .populate('userId', 'name avatar isStudent')
        .sort({ createdAt: -1 });
      res.json(reviews);
    } catch (error) { next(error); }
  });

  app.post('/api/reviews/:placeId', async (req, res, next) => {
    try {
      const { userId, rating, comment } = reviewSchema.parse(req.body);
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      const review = await Review.create({
        placeId: req.params.placeId,
        userId,
        rating,
        comment,
        isStudentReview: user.isStudent,
      });
      
      // After creating a review, update the place's average ratings
      await updatePlaceRatings(req.params.placeId);
      
      res.status(201).json(review);
    } catch (error) { next(error); }
  });

  // --- Offers Routes ---
  app.get('/api/offers', async (req, res, next) => {
    try {
      const offers = await Offer.find({ isActive: true, expiresAt: { $gte: new Date() } })
        .populate('placeId', 'name images');
      res.json(offers);
    } catch (error) { next(error); }
  });

  // All other POST routes and Admin routes remain the same as the previous full version...
  // ... (vehicles, trips, events, posts, admin routes etc.)

  // --- Vehicle Routes ---
  app.get('/api/vehicles', async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find({ isVerified: true, isAvailable: true }).populate('ownerId', 'name');
        res.json(vehicles);
    } catch (error) { next(error); }
  });

  app.get('/api/vehicles/:id', async (req, res, next) => {
      try {
        const vehicle = await Vehicle.findById(req.params.id).populate('ownerId', 'name email');
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
      } catch (error) { next(error); }
  });

  app.post('/api/vehicles', async (req, res, next) => {
      try {
          const validatedData = vehicleSchema.parse(req.body);
          const newVehicle = await Vehicle.create(validatedData);
          res.status(201).json(newVehicle);
      } catch (error) { next(error); }
  });

  // --- Trip Routes ---
  app.get('/api/trips/:userId', async (req, res, next) => {
      try {
        const trips = await Trip.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(trips);
      } catch (error) { next(error); }
  });

  app.post('/api/trips', async (req, res, next) => {
      try {
        const newTrip = await Trip.create(req.body);
        res.status(201).json(newTrip);
      } catch (error) { next(error); }
  });

  // --- Event Routes ---
  app.get('/api/events', async (req, res, next) => {
      try {
        const events = await Event.find({ isApproved: true, date: { $gte: new Date() } })
          .populate('organizerId', 'name')
          .sort({ date: 1 });
        res.json(events);
      } catch (error) { next(error); }
  });

  app.post('/api/events', async (req, res, next) => {
      try {
        const newEvent = await Event.create(req.body);
        res.status(201).json(newEvent);
      } catch (error) { next(error); }
  });

  // --- Community Post Routes ---
  app.get('/api/posts', async (req, res, next) => {
      try {
        const posts = await Post.find()
          .populate('userId', 'name avatar isStudent')
          .sort({ createdAt: -1 })
          .limit(50);
        res.json(posts);
      } catch (error) { next(error); }
  });
    
  app.post('/api/posts', async (req, res, next) => {
      try {
        const { userId, content } = postSchema.parse(req.body);
        const post = await Post.create({ userId, content });
        const populatedPost = await post.populate('userId', 'name avatar isStudent');
        res.status(201).json(populatedPost);
      } catch (error) { next(error); }
  });

  // --- Admin Routes ---
  app.get('/api/admin/vehicles/pending', async (req, res, next) => {
      try {
        const vehicles = await Vehicle.find({ isVerified: false }).populate('ownerId', 'name email');
        res.json(vehicles);
      } catch (error) { next(error); }
  });
    
  app.post('/api/admin/vehicles/:vehicleId/verify', async (req, res, next) => {
      try {
        const { approve } = req.body;
        if (approve) {
          await Vehicle.findByIdAndUpdate(req.params.vehicleId, { isVerified: true });
        } else {
          await Vehicle.findByIdAndDelete(req.params.vehicleId);
        }
        res.json({ success: true, message: `Vehicle ${approve ? 'approved' : 'rejected'}.` });
      } catch (error) { next(error); }
  });

  const httpServer = createServer(app);
  return httpServer;
}