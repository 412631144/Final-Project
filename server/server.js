const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Serve static files from client/public/images
const path = require('path');
app.use('/public', express.static(path.join(__dirname, '../client/public')));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
