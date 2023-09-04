const Redis = require("ioredis");
const MongoClient = require("mongodb").MongoClient;

// Initialize Redis
const redisClient = new Redis();

// Connect to MongoDB
const mongoClient = new MongoClient("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoClient.connect();

// Read student data with caching
async function getStudentData(studentId) {
  // Check if data exists in Redis cache
  const cachedData = await redisClient.get(`student:${studentId}`);

  if (cachedData) {
    console.log("Data retrieved from Redis cache");
    return JSON.parse(cachedData);
  } else {
    // Data not found in cache, retrieve from MongoDB
    const db = mongoClient.db("yourdb");
    const collection = db.collection("students");

    const dataFromMongo = await collection.findOne({ _id: studentId });

    if (dataFromMongo) {
      // Store data in Redis cache with an expiration time (e.g., 1 hour)
      await redisClient.set(`student:${studentId}`, JSON.stringify(dataFromMongo), "EX", 3600);

      console.log("Data retrieved from MongoDB and cached");
      return dataFromMongo;
    } else {
      // Student not found in MongoDB
      console.log("Student not found");
      return null;
    }
  }
}

// Usage
const studentId = "your-student-id";
getStudentData(studentId)
  .then((data) => {
    if (data) {
      console.log("Student data:", data);
    } else {
      console.log("Student not found");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
