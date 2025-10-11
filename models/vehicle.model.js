import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  images: { type: [String], default: [] },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
  location: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  totalRentals: { type: Number, default: 0 },
}, {   timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

vehicleSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
export const Vehicle = mongoose.model('Vehicle', vehicleSchema);