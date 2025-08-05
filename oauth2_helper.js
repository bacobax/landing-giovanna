const { google } = require('googleapis');
const readline = require('readline');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

console.log(process.env);
// 1. Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 2. Generate consent URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',             // REQUIRED to get refresh_token
  prompt: 'consent',                  // REQUIRED to get refresh_token every time
  scope: ['https://www.googleapis.com/auth/drive'],
});

console.log('Visit this URL to authorize:', authUrl);

// 3. Wait for code input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Paste the code here: ', async (code) => {
  rl.close();
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('✅ Access Token:', tokens.access_token);
    console.log('🔄 Refresh Token:', tokens.refresh_token); // ← save this securely
    console.log('🕒 Expiry Date:', tokens.expiry_date);
  } catch (err) {
    console.error('❌ Error retrieving token', err);
  }
});