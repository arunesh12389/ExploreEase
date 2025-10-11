import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  discountPercentage: Number,
  discountAmount: Number,
  code: String,
  terms: String,
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, {   timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

offerSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
export const Offer = mongoose.model('Offer', offerSchema);