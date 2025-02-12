import { Router } from 'express';
const router = Router();
import Review from '../models/review.js';

// GET all reviews
router.get('/', async (req, res) => {
  try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.json(reviews); // Send the reviews as JSON
  } catch (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ message: err.message }); // Send error response
  }
});

// POST a new review
router.post('/', async (req, res) => {
  try {
      const { title, content } = req.body; // Extract title

      // Check if a review with the same title already exists
      const existingReview = await Review.findOne({ title, content });

      if (existingReview) {
          return res.status(400).json({ message: 'A review with this username already exists.' });
      }

      const review = new Review({
          title: req.body.title,
          content: req.body.content,
          rating: req.body.rating
      });

      const newReview = await review.save();
      res.status(201).json(newReview);
  } catch (err) {
      console.error("Error saving review:", err);
      res.status(400).json({ message: err.message });
  }
});

export default router;
