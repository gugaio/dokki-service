// @/documentController.test.js
const supertest = require('supertest');
const app = require('../app'); // your express app

const metadataService = require('../services/metadataService');

jest.mock('../services/metadataService');

describe('Metadata', () => {

    beforeAll(() => {
    uuidKey = '123456789';
    s3Key = 'dataset/123456789.jpg';
    });

    afterEach(() => {
		jest.clearAllMocks();
	});


    describe('POST /ocr/:id', () => {

        it('api should return 422 if ocr json has no pages field', async () => {
            const ocrJson= {}
            const endpoint = `/ocr/${uuidKey}`;
            await supertest(app)
              .post(endpoint)
              .send(ocrJson)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(422); // expect 422 - Unprocessable Entity
          });

    });

    describe('GET /ocr/:id', () => {

        it('should return 200 if ocr json has pages field', async () => {
            const mockData = {};
            metadataService.getOcr.mockResolvedValue(mockData);

            const ocrJson= { pages: [] }
            const endpoint = `/ocr/${uuidKey}`;

            const response = await supertest(app)
              .get(endpoint)
              .send(ocrJson)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200); // expect 200 - OK

            expect(response.body).toEqual(mockData);

        });

    });


});