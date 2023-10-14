const request = require('supertest');
const app = require('./app');
const uploaderService = require('./services/uploaderService.js');

const TEST_UUID = '123456789';

jest.mock('./services/uploaderService', () => ({
    upload: jest.fn().mockResolvedValue({ uuidKey: TEST_UUID}),
}));

describe('POST /upload', () => {

  it('should upload a file to S3 and return the file URL', async () => {
    const filename = 'test.jpg';
    const buffer = Buffer.from('test');    
    const mimeType = 'image/jpeg';
    const response = { id: TEST_UUID };

    const res = await request(app)
      .post('/upload')
      .attach('file', buffer, { filename, contentType: mimeType });

    expect(res.status).toBe(200);
    expect(uploaderService.upload).toHaveBeenCalledTimes(1);
    expect(uploaderService.upload).toHaveBeenCalledWith(filename, buffer);
    expect(res.body).toEqual(response);
  });

  it('should return an error if no file is uploaded', async () => {
    const res = await request(app).post('/upload');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'No file uploaded' });
  });
});