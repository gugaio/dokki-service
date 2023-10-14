const request = require('supertest');
const app = require('./app');
const downloaderService = require('./services/downloaderService.js');
const uploaderService = require('./services/uploaderService.js');

const TEST_UUID = '123456789';
const TEST_FILE_CONTENTS = Buffer.from('test');

jest.mock('./services/uploaderService', () => ({
    upload: jest.fn().mockResolvedValue({ uuidKey: '123456789'}),
}));

jest.mock('./services/downloaderService', () => ({
    downloadDocument: jest.fn().mockResolvedValue(Buffer.from('test')),
}));

describe('POST /upload', () => {

    beforeAll((done) => {
        server = app.listen(3000, () => {
            console.log('Server started on port 3000');
            done();
        });
    });

    afterAll((done) => {
        server.close(done);
    });

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


describe('GET /download', () => {

    it('should return the file URL', async () => {
        const key = TEST_UUID;
        const response = Buffer.from('test');

        const res = await request(app)
        .get(`/download/${key}`);

        expect(res.status).toBe(200);
        expect(downloaderService.downloadDocument).toHaveBeenCalledTimes(1);
        expect(downloaderService.downloadDocument).toHaveBeenCalledWith(key);
        expect(res.body).toEqual(response);
    });

});