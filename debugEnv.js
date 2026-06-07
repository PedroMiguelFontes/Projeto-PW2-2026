require('dotenv').config();
const uri = process.env.MONGODB_URI;
console.log('MONGODB_URI raw:', uri); 
if (uri) {
  try {
    const { URL } = require('url');
    const parsed = uri.startsWith('mongodb') ? uri : `mongodb://${uri}`;
    console.log('Host part:', parsed.split('@').pop().split('/')[0]);
  } catch (e) {
    // ignore
  }
}