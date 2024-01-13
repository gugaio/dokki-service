// @/documentController.test.js
const supertest = require('supertest');
const app = require('../app'); // your express app
const documentService = require('../services/documentService');

jest.mock('../services/documentService');

describe('Documents', () => {

    beforeAll(() => {
        uuidKey = '123456789';
        s3Key = 'dataset/123456789.jpg';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('POST /documents', () => {

        it('should upload a file to S3 and return the file URL', async () => {
        const mockData = { uuidKey: uuidKey, s3Key: s3Key};
        documentService.upload.mockResolvedValue(mockData);

        const filename = 'test.jpg';
        const buffer = Buffer.from('test');
        const mimeType = 'image/jpeg';
        const outputExpectedResult = { id: uuidKey, s3Key: s3Key};

        const endpoint = '/documents';
        const res = await supertest(app)
            .post(endpoint)
            .attach('file', buffer, { filename, contentType: mimeType });

        expect(res.status).toBe(200);
        expect(documentService.upload).toHaveBeenCalledTimes(1);
        expect(documentService.upload).toHaveBeenCalledWith(filename, buffer);
        expect(res.body).toEqual(outputExpectedResult);
        });
    });


    describe('GET /documents', () => {
        it('responds with json', async () => {
            const mockData = [{ id: 1, name: 'Document 1' }, { id: 2, name: 'Document 2' }];
            documentService.tail.mockResolvedValue(mockData);

            const response = await supertest(app)
            .get('/documents')
            .expect('Content-Type', /json/)
            .expect(200); // expect 200 OK

            // Add more assertions here
            expect(response.body).toEqual(mockData);
        });

        it('responds with 500 if service throws', async () => {
            documentService.tail.mockRejectedValue(new Error('Bad things happened'));
            await supertest(app)
            .get('/documents')
            .expect('Content-Type', /json/)
            .expect(500); // expect 500 Internal Server Error
        });
    });

    describe('GET /documents/key', () => {


        it('should return content of file', async () => {
            const mockData = {mockField: 'mock contents'};
            documentService.download.mockResolvedValue(mockData);

            const key = uuidKey;
            const endpoint = `/documents/${key}`;

            const res = await supertest(app).get(endpoint);
            expect(res.status).toBe(200);
            expect(documentService.download).toHaveBeenCalledTimes(1);
            expect(documentService.download).toHaveBeenCalledWith(key);
            expect(res.body).toEqual(mockData);
        });

        it('should return 404 if key not exist', async () => {
            const mockData = {mockField: 'mock contents'};
            documentService.download.mockResolvedValue(mockData);

            const key = 'notexist';
            const endpoint = `/documents/${key}`;

            const res = await supertest(app).get(endpoint);

            expect(res.status).toBe(200);
            expect(documentService.download).toHaveBeenCalledTimes(1);
            expect(documentService.download).toHaveBeenCalledWith(key);
            expect(res.body).toEqual(mockData);
      });

    });

});