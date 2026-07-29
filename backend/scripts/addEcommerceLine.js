require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('../src/models/Template');

const ECOMMERCE_LINE = `I have also built a fully functional E-Commerce Website with features like product listing, cart, user authentication, and order management. You can check it out on my GitHub:\nhttps://github.com/KAIF-99-lg`;

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const templates = await Template.find({});

  for (const t of templates) {
    if (t.body.includes('E-Commerce')) continue; // skip if already added
    // Insert after the first project link paragraph
    t.body = t.body.replace(
      /(https:\/\/github\.com\/KAIF-99-lg\n)/,
      `$1\n${ECOMMERCE_LINE}\n`
    );
    await t.save();
    console.log(`Updated: ${t.roleName}`);
  }

  console.log('Done.');
  await mongoose.disconnect();
};

run().catch((e) => { console.error(e); process.exit(1); });
