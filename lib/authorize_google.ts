
const {google} = require('googleapis');
//read the .env.local file

function authorize() {
  const dotenv = require('dotenv');
  dotenv.config({ path: '.env.local' });


  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({
    access_token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN,
  });

  return oAuth2Client;
}

export { authorize };