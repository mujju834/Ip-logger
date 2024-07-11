const http = require('http');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Function to get the client's IP address
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
  return ip;
};

// Function to store IP address in MongoDB
const storeIpAddress = async (ip) => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('ip_addresses');
    const result = await collection.insertOne({ ip, timestamp: new Date() });
    console.log(`Stored IP address: ${ip} with ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Error storing IP address:', error);
  } finally {
    await client.close();
  }
};

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Only process the root URL path to avoid multiple entries for assets
  if (req.url === '/') {
    // Get the client's IP address
    const clientIp = getClientIp(req);

    // Log the IP address to the console
    console.log(`Client IP: ${clientIp}`);

    // Store the IP address in the database
    storeIpAddress(clientIp);

    // Send a response to the client
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Your IP address is ${clientIp}\n`);
  } else {
    // Send a response for other requests
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Resource not tracked\n');
  }
});

// Define the port to listen on
const PORT = 3000;
const HOST = '0.0.0.0';  // Listen on all network interfaces

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
