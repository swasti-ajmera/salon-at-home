const express = require('express');

// Initialize the application
const app = express();
const {connection} = require('./config/config');

// Routing path
app.get('/', (req, res) => {
  res.send('The team of "Salon at Home" thinks you are beautiful :)');
});

// Start the server
app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB");
      } catch (error) {
        console.log(error);
      }
      console.log("Server on 3000");
});