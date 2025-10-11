import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'is invalid'] },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isStudent: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  phone: String,
  avatar: String,
}, {  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
export const User = mongoose.model('User', userSchema);