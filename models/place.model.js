import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  images: { type: [String], default: [] },
  phone: String,
  website: String,
  priceRange: String,
  rating: { type: Number, default: 0 },
  studentRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  studentReviewCount: { type: Number, default: 0 },
  visitCount: { type: Number, default: 0 },
  studentVisitCount: { type: Number, default: 0 },
}, {   timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

placeSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
export const Place = mongoose.model('Place', placeSchema);