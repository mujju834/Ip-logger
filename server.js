const http = require('http');

// Function to get the client's IP address
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
  return ip;
};

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Get the client's IP address
  const clientIp = getClientIp(req);

  // Log the IP address to the console
  console.log(`Client IP: ${clientIp}`);

  // Send a response to the client
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Your IP address is ${clientIp}\n`);
});

// Define the port to listen on
const PORT = 3000;
const HOST = '0.0.0.0';  // Listen on all network interfaces

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
