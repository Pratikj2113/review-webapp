import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

export default model('Review', reviewSchema);
