# Salon at Home

A web application for managing salon appointments, built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB, featuring Firebase Authentication.

## Features

### User Features
- User authentication via Firebase (signup/login)
- Profile management with updatable user details
- View and book appointments with salons
- Cancel appointments within 18 hours of booking
- Dynamic salon cards display
- View appointment history and status

### Admin Features
- Salon details management
- Approve/reject appointment requests
- View and manage all appointments
- Dashboard with comprehensive booking data
- Profile and salon information updates

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB
- Firebase Authentication

## Project Structure

```
project-root/
├── models/                 # MongoDB schemas
│   ├── adminModel.js
│   ├── appointmentModel.js
│   ├── salonSchema.js
│   └── userModel.js
├── middleware/            # Custom middleware
├── config/               # Configuration files
│   └── config.js      # Firebase configuration
├── routes/              # API routes
│   ├── adminAuth.js
│   ├── appointmentRoute.js
│   ├── auth.js
│   ├── salonRoute.js
│   └── fetchSalon.js
├── public/              # Frontend files
│   ├── css/           # Stylesheet files
│   ├	 ├── adminDashboard.css
│   ├	 ├── adminLogin.css
│   ├	 ├── index.css
│   ├	 ├── login.css
│   ├	 ├── main.css
│   ├	 ├── salonDetails.css
│   ├	 ├── updateSalon.css
│   ├	 ├── userAppointments.css
│   ├	 └── userProfile.css   
│   ├── js/            # JavaScript files
│   ├	 ├── admin.js
│   ├	 ├── adminAppointment.js
│   ├	 ├── login.js
│   ├	 ├── salonDetails.js
│   ├	 ├── updateSalon.js
│   ├	 ├── userAppointment.js
│   ├	 └── userProfile.js
│   ├── adminDashboard.html
│   ├── adminLogin.html
│   ├── bookAppointment.html
│   ├── firebase.js
│   ├── index.html
│   ├── login.html
│   ├── main.html
│   ├── main.js
│   ├── salonDetails.html
│   ├── updateSalon.html
│   ├── userAppointments.html
│   └── userProfile.html
├── server.js           # Main server file
├── .env
├── package.json
└── package-lock.json
```

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd project-directory
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
# Create .env file in root directory
PORT=3000
MONGODB_URI=your_mongodb_uri
```

4. Set up Firebase
- Create a Firebase project
- Enable Authentication
- Add Firebase configuration to `/public/firebase.js`
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  // ... other firebase config
};
```

5. Run the application
```bash
npm start
```
The server will start on http://localhost:3000


## Team Members
1. Swasti - Backend Specialist
2. Rishwanth - Frontend Specialist
3. Preet - UI/UX and Integration
4. Mohit - Database and Testing
