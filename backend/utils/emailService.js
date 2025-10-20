/**
 * Email service for sending notifications
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    // This is a placeholder. In production, use a service like Nodemailer
    console.log(`Email sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${htmlContent}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

/**
 * Send booking confirmation email
 */
const sendBookingConfirmationEmail = async (user, booking, event) => {
  const subject = `Booking Confirmation - ${event.title}`;
  const htmlContent = `
    <h2>Booking Confirmed!</h2>
    <p>Dear ${user.firstName},</p>
    <p>Your booking for <strong>${event.title}</strong> has been confirmed.</p>
    <p><strong>Booking Details:</strong></p>
    <ul>
      <li>Booking Reference: ${booking.bookingReference}</li>
      <li>Event: ${event.title}</li>
      <li>Date: ${new Date(event.startDate).toLocaleDateString()}</li>
      <li>Tickets: ${booking.quantity}</li>
      <li>Total Price: $${booking.totalPrice}</li>
    </ul>
    <p>Your QR code is attached. Please present it at the venue.</p>
  `;

  return await sendEmail(user.email, subject, htmlContent);
};

/**
 * Send event reminder email
 */
const sendEventReminderEmail = async (user, event) => {
  const subject = `Reminder: ${event.title} is tomorrow!`;
  const htmlContent = `
    <h2>Event Reminder</h2>
    <p>Dear ${user.firstName},</p>
    <p>This is a reminder that <strong>${event.title}</strong> is happening tomorrow!</p>
    <p><strong>Event Details:</strong></p>
    <ul>
      <li>Date: ${new Date(event.startDate).toLocaleDateString()}</li>
      <li>Time: ${event.startTime}</li>
      <li>Venue: ${event.venue.name}</li>
    </ul>
    <p>Don't forget to bring your ticket QR code.</p>
  `;

  return await sendEmail(user.email, subject, htmlContent);
};

module.exports = {
  sendEmail,
  sendBookingConfirmationEmail,
  sendEventReminderEmail,
};
