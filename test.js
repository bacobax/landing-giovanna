const fs = require('fs');
const {google} = require('googleapis');
const {authorize} = require('./oauth_helper');

async function uploadBasic() {
  const auth = await authorize(); // ← usa OAuth2
  const service = google.drive({version: 'v3', auth});

  const requestBody = {
    name: 'test.jpg',
    fields: 'id',
  };

  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('public/assets/picprofile.JPG'),
  };

  try {
    const file = await service.files.create({
      requestBody,
      media: media,
    });
    console.log('File Id:', file.data.id);
    return file.data.id;
  } catch (err) {
    throw err;
  }
}

uploadBasic();