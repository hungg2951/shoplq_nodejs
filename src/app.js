const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require("./routes/authRoute");
const userRoutes = require('./routes/userRoute');
const accountRoutes = require('./routes/accountRoute');
const infoLoginAccRoutes = require('./routes/infoLoginAcc');
const orderRoutes = require('./routes/orderRoute');

const app = express();
const PORT = process.env.PORT || 8000

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes); 
app.use('/api', userRoutes);
app.use('/api', accountRoutes);
app.use('/api', infoLoginAccRoutes);
app.use('/api', orderRoutes);
// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
