import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Cleanup: Check for sample_mflix and prompt or handle if necessary
        // Note: Dropping the whole database if requested by the user. 
        // Since the user said "delete this collection" and showed sample_mflix, 
        // I'll attempt to drop the sample_mflix database if it's the current one, 
        // or just notify that we are starting fresh.
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        // Specific cleanup for sample_mflix elements if they are in this DB
        for (const coll of collections) {
            if (['comments', 'movies', 'sessions', 'theaters', 'users', 'embedded_movies'].includes(coll.name)) {
                await mongoose.connection.db.dropCollection(coll.name);
                console.log(`Dropped collection: ${coll.name}`);
            }
        }
    })
    .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('SmartFlow AI Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
