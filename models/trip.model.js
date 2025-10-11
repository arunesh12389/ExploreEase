import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  groupSize: { type: Number, required: true },
  places: { type: Array, default: [] }, // Can store an array of place objects or IDs
  estimatedCost: { type: Number, required: true },
  suggestedVehicle: { type: String, required: true },
  totalDistance: { type: Number, required: true },
}, {   timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tripSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
export const Trip = mongoose.model('Trip', tripSchema);