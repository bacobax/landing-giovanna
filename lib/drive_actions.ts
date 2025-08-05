import fs from 'fs';
import {google} from 'googleapis';
import {authorize} from './authorize_google';


export const uploadBasic = async (path: string, name: string) => {
  const auth = authorize(); // ← usa OAuth2
  const service = google.drive({version: 'v3', auth});

  const requestBody = {
    name: name,
    fields: 'id',
  };

  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(path),
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



export const downloadStream = async (fileId: string) => {
  const auth = authorize();
  const drive = google.drive({ version: 'v3', auth });
  try {
    const driveRes = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    driveRes.data
      .on('error', err => {
        console.error('Drive API error:', err);
      })
      .on('end', () => {
        // opzionale: log fine stream
      });   

    return driveRes.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};