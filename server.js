// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const postsRouter = require('./controllers/posts.js');
const charSheetsRouter = require('./controllers/charSheets.js');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const corsOptions = {
  origin: 'https://mothership-backend-b502f96270d5.herokuapp.com/',
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(logger('dev'));
app.options('*', cors());

// Routes
app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/charSheets', charSheetsRouter);

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('The express app is ready!');
});
