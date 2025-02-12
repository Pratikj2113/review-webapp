import 'dotenv/config'; // Load environment variables
import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import reviewRoutes from './routes/reviews.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json()); // for parsing application/json
connectDB();

// Routes
app.use('/api/reviews', reviewRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
