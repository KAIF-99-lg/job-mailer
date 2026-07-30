require('dotenv').config();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Resume = require('../src/models/Resume');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'set' : 'NOT SET');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('DB connected');

    const resume = await Resume.findOne({});
    console.log('Resume:', resume ? resume.originalName + ' (' + resume.fileData.length + ' bytes)' : 'NONE');

    if (!resume) { mongoose.disconnect(); return; }

    const transporter = nodemailer.createTransport({
      host: '74.125.68.108',
      port: 465,
      secure: true,
      family: 4,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'mdkaif8100@gmail.com',
      subject: 'Test Mail - Resume Attached',
      text: 'Hi, this is a test mail with resume attached.',
      attachments: [{ filename: resume.originalName, content: resume.fileData }],
    });

    console.log('Mail sent! ID:', info.messageId);
    mongoose.disconnect();
  })
  .catch(e => { console.log('Error:', e.message); });
