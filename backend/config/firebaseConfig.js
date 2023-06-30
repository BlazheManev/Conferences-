const admin = require ("firebase-admin");
require('dotenv').config();
const credentials = require ("./fir-strokovne-konference-firebase-adminsdk-v85g2-96948f9747.json");
credentials.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

module.exports = admin;
