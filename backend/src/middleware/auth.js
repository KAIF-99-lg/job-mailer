const mongoose = require('mongoose');
const OWNER_ID = new mongoose.Types.ObjectId('000000000000000000000001');
module.exports = { protect: (req, res, next) => { req.user = { _id: OWNER_ID }; next(); } };
