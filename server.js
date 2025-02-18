const express = require('express');
const path = require('path')
const cors = require("cors");
const userAuth = require("./routes/auth")
const adminAuth = require("./routes/adminAuth")
const salonRoute = require("./routes/salonRoute")
const fetchSalon = require("./routes/fetchSalon")
const appointmentRoute = require("./routes/appointmentRoute")

// Initialize the application
const app = express();
const {connection} = require('./config/config');

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// Static page path
app.use(express.static(path.join(__dirname, "public")))

// Routing path
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Creating user authentication API
app.use('/api/user', userAuth);
app.use('/api/admin', adminAuth);
app.use('/api/salon', salonRoute);
app.use(fetchSalon);
app.use('/api/appointments', appointmentRoute);

// Start the server
app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB");
      } catch (error) {
        console.log(error);
      }
      console.log("Server on 3000");
      console.log("Click here please: ", `http://localhost:3000`)
});