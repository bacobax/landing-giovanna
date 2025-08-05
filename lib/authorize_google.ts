
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

let currentAccessToken: string | null = null;

async function refreshAccessToken() {
  try {
    const { token } = await oAuth2Client.getAccessToken();
    currentAccessToken = token ?? null;
    console.log('✅ Access token refreshed');
  } catch (err) {
    console.error('❌ Error refreshing token:', err);
  }
}

refreshAccessToken();
setInterval(refreshAccessToken, 50 * 60 * 1000);

function authorize() {
  if (currentAccessToken) {
    oAuth2Client.setCredentials({
      access_token: currentAccessToken,
      refresh_token: REFRESH_TOKEN,
    });
  }
  return oAuth2Client;
}

function getAccessToken() {
  return currentAccessToken;
}

export { authorize, getAccessToken, oAuth2Client };
