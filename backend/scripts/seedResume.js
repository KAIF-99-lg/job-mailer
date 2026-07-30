require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Resume = require('../src/models/Resume');

const RESUME_PATH = path.join(__dirname, '../../KAIF_RESUME.pdf');
const USER_ID = '000000000000000000000001';

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('DB connected');

  const fileData = fs.readFileSync(RESUME_PATH);
  const fileName = path.basename(RESUME_PATH);

  await Resume.deleteOne({ userId: USER_ID });

  await Resume.create({
    userId: USER_ID,
    originalName: fileName,
    fileName: fileName,
    fileSize: fileData.length,
    mimeType: 'application/pdf',
    path: '',
    fileData: fileData,
  });

  console.log('Resume uploaded to MongoDB:', fileName, '(' + fileData.length + ' bytes)');
  mongoose.disconnect();
}).catch(e => { console.log('Error:', e.message); process.exit(1); });
