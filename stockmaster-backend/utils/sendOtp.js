const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  return transporter.sendMail(mailOptions);
};

const sendStaffSignupNotification = (staffDetails) => {
  const { username, email } = staffDetails;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
  
  const subject = "🔔 New Staff Member Signup - StockMaster";
  const text = `
Hello Manager,

A new staff member has signed up for StockMaster and is waiting for warehouse access.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAFF DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${username}
Email: ${email}
Role: Staff
Signup Date: ${new Date().toLocaleString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTION REQUIRED:
Please log in to your StockMaster dashboard to assign this staff member to a warehouse. 
The staff member will be able to access the system once they join a warehouse.

Dashboard: ${frontendUrl}/login

Thank you,
StockMaster System
  `;

  return { subject, text };
};

module.exports = { sendOtpEmail, sendStaffSignupNotification };
