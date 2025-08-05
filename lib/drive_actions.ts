import fs from 'fs';
import { Readable } from 'stream';
import { google } from 'googleapis';
import { authorize } from './authorize_google';

export const uploadBasic = async (path: string, name: string) => {
  const auth = authorize(); // ← usa OAuth2
  const service = google.drive({ version: 'v3', auth });

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
};

export const uploadBuffer = async (
  buffer: Buffer,
  name: string,
  mimeType: string,
) => {
  const auth = authorize();
  const service = google.drive({ version: 'v3', auth });
  const requestBody = { name, fields: 'id' };
  const media = {
    mimeType,
    body: Readable.from(buffer),
  };
  try {
    const file = await service.files.create({ requestBody, media });
    return file.data.id as string;
  } catch (err) {
    throw err;
  }
};

export const deleteFile = async (fileId: string) => {
  const auth = authorize();
  const service = google.drive({ version: 'v3', auth });
  try {
    await service.files.delete({ fileId });
  } catch (err) {
    throw err;
  }
};

export const updateFile = async (
  fileId: string,
  buffer: Buffer,
  mimeType: string,
) => {
  const auth = authorize();
  const service = google.drive({ version: 'v3', auth });
  const media = { mimeType, body: Readable.from(buffer) };
  try {
    await service.files.update({ fileId, media });
  } catch (err) {
    throw err;
  }
};

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

