// @/documentController.test.js
const supertest = require('supertest');
const app = require('../app'); // your express app

jest.mock('../services/metadataService');

describe('Metadata', () => {

    beforeAll(() => {
    uuidKey = '123456789';
    s3Key = 'dataset/123456789.jpg';
    });

    afterEach(() => {
		jest.clearAllMocks();
	});


    describe('POST /documents/:id/ocr', () => {

        it('api should return 422 if ocr json has no pages field', async () => {
            const ocrJson= {}
            const endpoint = `/documents/${uuidKey}/ocr`;
            await supertest(app)
              .post(endpoint)
              .send(ocrJson)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(422); // expect 422 - Unprocessable Entity
          });

    });


});