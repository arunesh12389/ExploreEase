import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Users Table ---
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isStudent: boolean("is_student").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  phone: text("phone"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

// --- Places Table ---
export const places = pgTable("places", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  images: text("images").array().notNull().default(sql`'{}'::text[]`),
  phone: text("phone"),
  website: text("website"),
  priceRange: text("price_range"),
  rating: real("rating").notNull().default(0),
  studentRating: real("student_rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  studentReviewCount: integer("student_review_count").notNull().default(0),
  visitCount: integer("visit_count").notNull().default(0),
  studentVisitCount: integer("student_visit_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlaceSchema = createInsertSchema(places).omit({
  id: true,
  rating: true,
  studentRating: true,
  reviewCount: true,
  studentReviewCount: true,
  visitCount: true,
  studentVisitCount: true,
  createdAt: true,
});


// --- Reviews Table ---
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  placeId: varchar("place_id").notNull().references(() => places.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  images: text("images").array().notNull().default(sql`'{}'::text[]`),
  isStudentReview: boolean("is_student_review").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  isStudentReview: true,
  createdAt: true,
});


// --- Vehicles Table ---
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text("type").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  capacity: integer("capacity").notNull(),
  pricePerDay: real("price_per_day").notNull(),
  images: text("images").array().notNull().default(sql`'{}'::text[]`),
  description: text("description").notNull(),
  features: text("features").array().notNull().default(sql`'{}'::text[]`),
  location: text("location").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  isAvailable: boolean("is_available").notNull().default(true),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  totalRentals: integer("total_rentals").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  isVerified: true,
  rating: true,
  reviewCount: true,
  totalRentals: true,
  createdAt: true,
});


// --- Offers Table ---
export const offers = pgTable("offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  placeId: varchar("place_id").notNull().references(() => places.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountPercentage: integer("discount_percentage"),
  discountAmount: real("discount_amount"),
  code: text("code"),
  terms: text("terms"),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  isActive: true,
  createdAt: true,
});


// --- Trips Table ---
export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  groupSize: integer("group_size").notNull(),
  // JSONB column type is preserved, the.$type<{...}> is only for TS inference
  places: jsonb("places").notNull().default(sql`'[]'::jsonb`),
  estimatedCost: real("estimated_cost").notNull(),
  suggestedVehicle: text("suggested_vehicle").notNull(),
  totalDistance: real("total_distance").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
});


// --- Bookings Table ---
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalCost: real("total_cost").notNull(),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
  createdAt: true,
});


// --- Utility Arrays (No type change needed for runtime value arrays) ---
export const categories = [
  'Attractions',
  'Restaurants',
  'Cafes',
  'Services',
  'Shopping',
  'Events',
  'Hotels',
  'Transportation',
];


export const vehicleTypes = [
  'Bike',
  'Scooter',
  'Car',
  'SUV',
  'Van',
];
