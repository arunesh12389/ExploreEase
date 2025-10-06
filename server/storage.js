// Removed all 'type' imports and type annotations.
// Assuming @shared/schema.ts was renamed to @shared/schema.js
import { randomUUID } from "crypto";

// The IStorage interface is now implicitly defined by the MemStorage class structure
// since interfaces are a TypeScript-only concept.

export class MemStorage {
  // Private fields are preserved using Map data structure, standard in modern JS
  #users = new Map();
  #places = new Map();
  #reviews = new Map();
  #vehicles = new Map();
  #offers = new Map();
  #trips = new Map();
  #bookings = new Map();

  async getUser(id) {
    return this.#users.get(id);
  }

  async getUserByEmail(email) {
    return Array.from(this.#users.values()).find(u => u.email === email);
  }

  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      isAdmin: insertUser.isAdmin || false,
      phone: insertUser.phone || null,
      avatar: insertUser.avatar || null,
      createdAt: new Date(),
    };
    this.#users.set(id, user);
    return user;
  }

  async getAllPlaces() {
    return Array.from(this.#places.values());
  }

  async getPlace(id) {
    return this.#places.get(id);
  }

  async createPlace(insertPlace) {
    const id = randomUUID();
    const place = {
      ...insertPlace,
      id,
      rating: 0,
      studentRating: 0,
      reviewCount: 0,
      studentReviewCount: 0,
      visitCount: 0,
      studentVisitCount: 0,
      createdAt: new Date(),
    };
    this.#places.set(id, place);
    return place;
  }

  // TypeScript types removed from method signature
  async updatePlaceRatings(placeId, isStudentReview) {
    const place = this.#places.get(placeId);
    if (!place) return;

    const reviews = await this.getReviewsByPlace(placeId);
    const allRatings = reviews.map(r => r.rating);
    const studentRatings = reviews.filter(r => r.isStudentReview).map(r => r.rating);

    const rating = allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0;
    const studentRating = studentRatings.length > 0 ? studentRatings.reduce((a, b) => a + b, 0) / studentRatings.length : 0;

    place.rating = rating;
    place.studentRating = studentRating;
    place.reviewCount = allRatings.length;
    place.studentReviewCount = studentRatings.length;
    this.#places.set(placeId, place);
  }

  // TypeScript types removed from method signature
  async incrementPlaceVisits(placeId, isStudent) {
    const place = this.#places.get(placeId);
    if (!place) return;
    
    place.visitCount++;
    if (isStudent) place.studentVisitCount++;
    this.#places.set(placeId, place);
  }

  async getTrendingPlaces(limit = 5) {
    return Array.from(this.#places.values())
      .sort((a, b) => b.studentVisitCount - a.studentVisitCount)
      .slice(0, limit);
  }

  async getFeaturedPlaces(limit = 8) {
    return Array.from(this.#places.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  async getReviewsByPlace(placeId) {
    return Array.from(this.#reviews.values()).filter(r => r.placeId === placeId);
  }

  // TypeScript types removed from method signature
  async createReview(insertReview, userId, isStudent) {
    const id = randomUUID();
    const review = {
      ...insertReview,
      id,
      userId,
      isStudentReview: isStudent,
      createdAt: new Date(),
    };
    this.#reviews.set(id, review);
    await this.updatePlaceRatings(insertReview.placeId, isStudent);
    return review;
  }

  async getAllVehicles() {
    return Array.from(this.#vehicles.values());
  }

  async getVehicle(id) {
    return this.#vehicles.get(id);
  }

  async getPendingVehicles() {
    return Array.from(this.#vehicles.values()).filter(v => !v.isVerified);
  }

  async createVehicle(insertVehicle) {
    const id = randomUUID();
    const vehicle = {
      ...insertVehicle,
      id,
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      totalRentals: 0,
      createdAt: new Date(),
    };
    this.#vehicles.set(id, vehicle);
    return vehicle;
  }

  // TypeScript types removed from method signature
  async updateVehicleVerification(vehicleId, isVerified) {
    const vehicle = this.#vehicles.get(vehicleId);
    if (!vehicle) return;
    
    vehicle.isVerified = isVerified;
    this.#vehicles.set(vehicleId, vehicle);
  }

  async getAllOffers() {
    return Array.from(this.#offers.values());
  }

  async getActiveOffers() {
    const now = new Date();
    return Array.from(this.#offers.values()).filter(
      o => o.isActive && new Date(o.expiresAt) > now
    );
  }

  async createOffer(insertOffer) {
    const id = randomUUID();
    const offer = {
      ...insertOffer,
      id,
      isActive: true,
      createdAt: new Date(),
    };
    this.#offers.set(id, offer);
    return offer;
  }

  async getTripsByUser(userId) {
    return Array.from(this.#trips.values()).filter(t => t.userId === userId);
  }

  async createTrip(insertTrip) {
    const id = randomUUID();
    const trip = {
      ...insertTrip,
      id,
      createdAt: new Date(),
    };
    this.#trips.set(id, trip);
    return trip;
  }

  async createBooking(insertBooking) {
    const id = randomUUID();
    const booking = {
      ...insertBooking,
      id,
      status: 'pending',
      createdAt: new Date(),
    };
    this.#bookings.set(id, booking);
    return booking;
  }
}

export const storage = new MemStorage();
