require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('Connecting to Gmail SMTP...');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

transporter.verify((err) => {
  if (err) {
    console.log('SMTP VERIFY FAILED:', err.message);
    process.exit(1);
  }
  console.log('SMTP OK — sending mail...');

  transporter.sendMail({
    from: `"Md Kaif" <${process.env.EMAIL_USER}>`,
    to: 'k82102002@gmail.com',
    subject: 'Application for Backend Developer Role | Md Kaif',
    text: `Dear Hiring Manager,

I hope this message finds you well. I am writing to express my strong interest in the Backend Developer position at your organization.

I am a skilled Backend Developer with hands-on experience in:
- Node.js, Express.js, REST APIs
- MongoDB, Mongoose, JWT Authentication
- Email Automation, File Uploads
- React.js, TypeScript

I have built production-ready applications including a full-stack AI SaaS platform (JobMailer AI).

I would love the opportunity to contribute to your team.

Best regards,
Md Kaif
Email: k82102002@gmail.com`,
  }, (err2, info) => {
    if (err2) {
      console.log('SEND FAILED:', err2.message);
      process.exit(1);
    }
    console.log('EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    process.exit(0);
  });
});

setTimeout(() => {
  console.log('TIMEOUT — SMTP not responding after 20s. Possible causes:');
  console.log('1. Firewall/antivirus blocking port 465/587');
  console.log('2. Gmail App Password incorrect');
  console.log('3. No internet connection');
  process.exit(2);
}, 20000);
