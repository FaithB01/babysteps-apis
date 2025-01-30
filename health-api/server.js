// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(bodyParser.json());

// app.use('/api/users', userRoutes);





// app.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {

    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

// Connect to the database
connectDB();

// Routes (example)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware
app.use(express.json());

// Mount routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://fnbiketi:babysteps@babystepscluster0.tefna.mongodb.net/?retryWrites=true&w=majority&appName=BabyStepsCluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



