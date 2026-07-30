require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Resume = require('../src/models/Resume');

const RESUME_PATH = 'C:\\Users\\Lenovo\\Downloads\\KAIF_RESUME.pdf';
const USER_ID = '6a68f78b064c014b3a9f24a3';

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
