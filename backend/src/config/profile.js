const path = require('path');

const profile = {
  name: 'Md Kaif',
  email: 'mdkaif8100@gmail.com',
  phone: '+91 7439566547',
  linkedin: 'https://www.linkedin.com/in/md-kaif-964567251/',
  github: 'https://github.com/KAIF-99-lg',
  portfolio: 'https://project-management-app-theta-five.vercel.app/',
  leetcode: 'https://leetcode.com/u/MD_KAIF_99/',
  resumeFileName: 'KAIF_RESUME.pdf',
  resumePath: path.resolve(__dirname, '../../../KAIF_RESUME.pdf'),
  preferredDelay: 5000,
};

const getProfile = () => ({ ...profile });

module.exports = { profile, getProfile };
