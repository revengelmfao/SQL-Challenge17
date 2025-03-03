import express from 'express';
import connectDB from './config/connection.js';
import routes from './routes/index.js';

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use(routes);

// Connect to the database before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});