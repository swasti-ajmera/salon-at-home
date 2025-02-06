
// // emailService.js
// const nodemailer = require('nodemailer');
// require('dotenv').config();


// // Configure nodemailer with your email service
// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     secure:false,  // or your preferred email service
//     auth: {
//         user: process.env.SALON_USER,
//         pass: process.env.SALON_PASSWORD
//     },
//     tls:{
//         ciphers: 'SSLv3'
//     }
// });

// const sendAppointmentEmail = async (userEmail, status, appointmentDetails, rejectionReason = '') => {
//     let subject = '';
//     let htmlContent = '';

//     if (status === 'Approved') {
//         subject = 'Your Appointment Has Been Approved!';
//         htmlContent = `
//             <h2>Appointment Approved</h2>
//             <p>Your appointment has been approved with the following details:</p>
//             <ul>
//                 <li>Service: ${appointmentDetails.service}</li>
//                 <li>Date: ${new Date(appointmentDetails.date).toLocaleDateString()}</li>
//                 <li>Time: ${appointmentDetails.time}</li>
//             </ul>
//             <p>We look forward to seeing you!</p>
//         `;
//     } else if (status === 'Rejected') {
//         subject = 'Update Regarding Your Appointment Request';
//         htmlContent = `
//             <h2>Appointment Status Update</h2>
//             <p>Unfortunately, we are unable to accommodate your appointment request for:</p>
//             <ul>
//                 <li>Service: ${appointmentDetails.service}</li>
//                 <li>Date: ${new Date(appointmentDetails.date).toLocaleDateString()}</li>
//                 <li>Time: ${appointmentDetails.time}</li>
//             </ul>
//             <p><strong>Reason:</strong> ${rejectionReason}</p>
//             <p>Please feel free to book another appointment at a different time.</p>
//         `;
//     }

//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: userEmail,
//             subject,
//             html: htmlContent
//         });
//         return true;
//     } catch (error) {
//         console.error('Email sending failed:', error);
//         return false;
//     }
// };

// module.exports = { sendAppointmentEmail };
