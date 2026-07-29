/**
 * Run this script ONCE to update all existing templates in MongoDB.
 * Usage: node scripts/updateTemplates.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Template = require('../src/models/Template');

const UPDATED_TEMPLATES = [
  {
    roleName: 'Frontend Developer',
    subject: 'Application for Frontend Developer | {{candidateName}}',
    body: `{{greeting}}

I came across the Frontend Developer opening and wanted to reach out directly. I have been building web interfaces for a while now and genuinely enjoy the craft of making things look good and work well.

I am comfortable with React, JavaScript, HTML, and CSS. I pay attention to performance, accessibility, and clean component structure. I have worked on real projects — one of them is a Project Management Web App I built from scratch, which you can check out here:
https://project-management-app-theta-five.vercel.app/

My GitHub has more of my work:
https://github.com/KAIF-99-lg

I have attached my resume. Happy to jump on a call whenever works for you.

Thanks for your time.

Best,
{{candidateName}}
7439566547
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'Backend Developer',
    subject: 'Application for Backend Developer | {{candidateName}}',
    body: `{{greeting}}

I wanted to apply for the Backend Developer role. I work with Node.js and Express, and I have built REST APIs, handled authentication, worked with MongoDB, and deployed applications on the cloud.

I recently built a full backend for a SaaS application — it includes JWT auth, email queuing, file uploads, and a proper MVC structure. You can see my projects on GitHub:
https://github.com/KAIF-99-lg

I also built a Project Management Web App that is live here:
https://project-management-app-theta-five.vercel.app/

My resume is attached. I would be glad to discuss the role further.

Thanks,
{{candidateName}}
7439566547
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'MERN Stack Developer',
    subject: 'Application for MERN Stack Developer | {{candidateName}}',
    body: `{{greeting}}

I am writing to apply for the MERN Stack Developer position. I have hands-on experience with MongoDB, Express, React, and Node.js and have used this stack to build complete, production-ready applications.

One project I am particularly proud of is a Project Management Web App — it is live and you can try it here:
https://project-management-app-theta-five.vercel.app/

For the backend side, I have built things like JWT authentication, Nodemailer integration, file upload handling with Multer, and proper error handling. My code is on GitHub if you want to take a look:
https://github.com/KAIF-99-lg

Resume is attached. Looking forward to hearing from you.

Regards,
{{candidateName}}
7439566547
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'Full Stack Developer',
    subject: 'Application for Full Stack Developer | {{candidateName}}',
    body: `{{greeting}}

I am reaching out regarding the Full Stack Developer opening. I work across the entire stack — React on the frontend, Node.js and Express on the backend, and MongoDB for the database.

I have built and deployed real applications. One of them is a Project Management Web App that handles tasks, teams, and deadlines — live at:
https://project-management-app-theta-five.vercel.app/

I also built a complete SaaS backend with features like email automation, resume uploads, JWT auth, and dashboard analytics. You can explore my work on GitHub:
https://github.com/KAIF-99-lg

I have attached my resume. Would love to connect and talk more about the role.

Thanks,
{{candidateName}}
7439566547
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'React Developer',
    subject: 'Application for React Developer | {{candidateName}}',
    body: `{{greeting}}

I wanted to apply for the React Developer role. React is what I spend most of my time in — building components, managing state, handling routing, and making sure the UI is smooth and responsive.

I have a live project you can check out — a Project Management Web App built with React:
https://project-management-app-theta-five.vercel.app/

More of my React work is on GitHub:
https://github.com/KAIF-99-lg

Resume is attached. Happy to share more details or do a quick call.

Best,
{{candidateName}}
7439566547
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'Node.js Developer',
    subject: 'Application for Node.js Developer | {{candidateName}}',
    body: `{{greeting}}

I am applying for the Node.js Developer position. I have been working with Node.js and Express to build backend systems — REST APIs, middleware, authentication flows, database integration with Mongoose, and email services using Nodemailer.

I recently built a production-ready backend for a SaaS app that handles bulk email sending, file uploads, JWT auth, and history tracking. The code is on GitHub:
https://github.com/KAIF-99-lg

I also have a full-stack project live here:
https://project-management-app-theta-five.vercel.app/

My resume is attached. Let me know if you would like to discuss further.

Thanks,
{{candidateName}}
7439566547
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'Software Engineer',
    subject: 'Application for Software Engineer | {{candidateName}}',
    body: `{{greeting}}

I am writing to apply for the Software Engineer role. I have experience building web applications end to end — from designing the database schema to writing the API to building the frontend UI.

I take problem-solving seriously. I actively practice DSA on LeetCode and have solved problems across arrays, strings, trees, and dynamic programming:
https://leetcode.com/u/MD_KAIF_99/

For real-world projects, here is a Project Management App I built and deployed:
https://project-management-app-theta-five.vercel.app/

My full code is on GitHub:
https://github.com/KAIF-99-lg

Resume is attached. I would appreciate the chance to speak with your team.

Regards,
{{candidateName}}
7439566547
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg
LeetCode: https://leetcode.com/u/MD_KAIF_99/`,
  },
  {
    roleName: 'Java Developer',
    subject: 'Application for Java Developer | {{candidateName}}',
    body: `{{greeting}}

I am applying for the Java Developer position. I have a solid understanding of Java fundamentals, OOP concepts, and data structures and algorithms. I have solved numerous DSA problems in Java — you can see my solutions on GitHub:
https://github.com/KAIF-99-lg

I also practice regularly on LeetCode where I have solved problems across arrays, linked lists, trees, graphs, and dynamic programming:
https://leetcode.com/u/MD_KAIF_99/

Apart from DSA, I have built full-stack web applications. One of them is live here:
https://project-management-app-theta-five.vercel.app/

I am a quick learner and comfortable picking up new frameworks and tools. My resume is attached for your reference.

Thanks for your time.

Best,
{{candidateName}}
7439566547
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg
LeetCode: https://leetcode.com/u/MD_KAIF_99/`,
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB.');

  let updated = 0;
  for (const t of UPDATED_TEMPLATES) {
    const result = await Template.updateMany(
      { roleName: t.roleName },
      { $set: { subject: t.subject, body: t.body, isDefault: true } }
    );
    console.log(`${t.roleName}: ${result.modifiedCount} updated`);
    updated += result.modifiedCount;
  }

  console.log(`\nDone. Total updated: ${updated}`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
