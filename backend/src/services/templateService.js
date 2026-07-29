const Template = require('../models/Template');
const AppError = require('../utils/AppError');

const DEFAULT_TEMPLATES = [
  {
    roleName: 'Frontend Developer',
    subject: 'Application for Frontend Developer | {{candidateName}}',
    body: `{{greeting}}

I came across the Frontend Developer opening and wanted to reach out directly. I have been building web interfaces for a while now and genuinely enjoy the craft of making things look good and work well.

I am comfortable with React, JavaScript, HTML, and CSS. I pay attention to performance, accessibility, and clean component structure. I have worked on real projects — one of them is a Project Management Web App I built from scratch, and another is a fully functional E-Commerce Website with product listing, cart, and order management.

Project Management App: https://project-management-app-theta-five.vercel.app/

My GitHub has more of my work:
https://github.com/KAIF-99-lg

I have attached my resume. Happy to jump on a call whenever works for you.

Thanks for your time.

Best,
{{candidateName}}
{{phone}}
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'Backend Developer',
    subject: 'Application for Backend Developer | {{candidateName}}',
    body: `{{greeting}}

I wanted to apply for the Backend Developer role. I work with Node.js and Express, and I have built REST APIs, handled authentication, worked with MongoDB, and deployed applications on the cloud.

I recently built a full backend for a SaaS application — it includes JWT auth, email queuing, file uploads, and a proper MVC structure. I have also built a fully functional E-Commerce Website with product listing, cart, authentication, and order management.

You can see my projects on GitHub:
https://github.com/KAIF-99-lg

I also built a Project Management Web App that is live here:
https://project-management-app-theta-five.vercel.app/

My resume is attached. I would be glad to discuss the role further.

Thanks,
{{candidateName}}
{{phone}}
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'MERN Stack Developer',
    subject: 'Application for MERN Stack Developer | {{candidateName}}',
    body: `{{greeting}}

I am writing to apply for the MERN Stack Developer position. I have hands-on experience with MongoDB, Express, React, and Node.js and have used this stack to build complete, production-ready applications.

Some projects I am particularly proud of — a Project Management Web App (live here):
https://project-management-app-theta-five.vercel.app/

And a fully functional E-Commerce Website with product listing, cart, user authentication, and order management.

For the backend side, I have built things like JWT authentication, Nodemailer integration, file upload handling with Multer, and proper error handling. My code is on GitHub if you want to take a look:
https://github.com/KAIF-99-lg

Resume is attached. Looking forward to hearing from you.

Regards,
{{candidateName}}
{{phone}}
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

I have also built a fully functional E-Commerce Website with product listing, cart, user authentication, and order management.

I also built a complete SaaS backend with features like email automation, resume uploads, JWT auth, and dashboard analytics. You can explore my work on GitHub:
https://github.com/KAIF-99-lg

I have attached my resume. Would love to connect and talk more about the role.

Thanks,
{{candidateName}}
{{phone}}
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

I have also built a fully functional E-Commerce Website with features like product listing, cart, user authentication, and order management.

More of my React work is on GitHub:
https://github.com/KAIF-99-lg

Resume is attached. Happy to share more details or do a quick call.

Best,
{{candidateName}}
{{phone}}
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'Node.js Developer',
    subject: 'Application for Node.js Developer | {{candidateName}}',
    body: `{{greeting}}

I am applying for the Node.js Developer position. I have been working with Node.js and Express to build backend systems — REST APIs, middleware, authentication flows, database integration with Mongoose, and email services using Nodemailer.

I recently built a production-ready backend for a SaaS app that handles bulk email sending, file uploads, JWT auth, and history tracking. I have also built the backend for a fully functional E-Commerce Website. The code is on GitHub:
https://github.com/KAIF-99-lg

I also have a full-stack project live here:
https://project-management-app-theta-five.vercel.app/

My resume is attached. Let me know if you would like to discuss further.

Thanks,
{{candidateName}}
{{phone}}
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg`,
  },
  {
    roleName: 'Software Engineer',
    subject: 'Application for Software Engineer | {{candidateName}}',
    body: `{{greeting}}

I am writing to apply for the Software Engineer role. I have experience building web applications end to end — from designing the database schema to writing the API to building the frontend UI.

I take problem-solving seriously. I actively practice DSA on LeetCode and have solved a good number of problems across arrays, strings, trees, and dynamic programming:
https://leetcode.com/u/MD_KAIF_99/

For real-world projects, I have built a Project Management App and a fully functional E-Commerce Website. The Project Management App is live here:
https://project-management-app-theta-five.vercel.app/

My full code is on GitHub:
https://github.com/KAIF-99-lg

Resume is attached. I would appreciate the chance to speak with your team.

Regards,
{{candidateName}}
{{phone}}
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

Apart from DSA, I have built full-stack web applications including a Project Management App and a fully functional E-Commerce Website with product listing, cart, and order management. The Project Management App is live here:
https://project-management-app-theta-five.vercel.app/

I am a quick learner and comfortable picking up new frameworks and tools. My resume is attached for your reference.

Thanks for your time.

Best,
{{candidateName}}
{{phone}}
{{email}}
LinkedIn: https://www.linkedin.com/in/md-kaif-964567251/
GitHub: https://github.com/KAIF-99-lg
LeetCode: https://leetcode.com/u/MD_KAIF_99/`,
  },
];

class TemplateService {
  /**
   * Seed default templates for a newly registered user.
   * @param {string} userId
   */
  async seedDefaultTemplates(userId) {
    const templates = DEFAULT_TEMPLATES.map((t) => ({
      roleName: t.roleName,
      subject: t.subject,
      body: t.body,
      createdBy: userId,
      isDefault: true,
    }));

    await Template.insertMany(templates, { ordered: false }).catch(() => {});
  }

  /**
   * Get all templates for a user.
   * @param {string} userId
   * @returns {Promise<Template[]>}
   */
  async getAllByUser(userId) {
    return Template.find({ createdBy: userId }).sort({ roleName: 1 }).lean();
  }

  /**
   * Get a single template by ID, ensuring ownership.
   * @param {string} templateId
   * @param {string} userId
   * @returns {Promise<Template>}
   */
  async getById(templateId, userId) {
    const template = await Template.findOne({ _id: templateId, createdBy: userId });
    if (!template) throw new AppError('Template not found.', 404);
    return template;
  }

  /**
   * Get template by role name for a user.
   * @param {string} roleName
   * @param {string} userId
   * @returns {Promise<Template>}
   */
  async getByRole(roleName, userId) {
    const template = await Template.findOne({ roleName, createdBy: userId });
    if (!template) throw new AppError(`No template found for role: ${roleName}`, 404);
    return template;
  }

  /**
   * Create a new template.
   * @param {object} data
   * @param {string} userId
   * @returns {Promise<Template>}
   */
  async create(data, userId) {
    const template = await Template.create({ ...data, createdBy: userId });
    return template;
  }

  /**
   * Update an existing template.
   * @param {string} templateId
   * @param {object} data
   * @param {string} userId
   * @returns {Promise<Template>}
   */
  async update(templateId, data, userId) {
    const template = await Template.findOneAndUpdate(
      { _id: templateId, createdBy: userId },
      { ...data, isDefault: false },
      { new: true, runValidators: true }
    );
    if (!template) throw new AppError('Template not found.', 404);
    return template;
  }

  /**
   * Delete a template.
   * @param {string} templateId
   * @param {string} userId
   */
  async delete(templateId, userId) {
    const template = await Template.findOneAndDelete({ _id: templateId, createdBy: userId });
    if (!template) throw new AppError('Template not found.', 404);
  }
}

module.exports = new TemplateService();
