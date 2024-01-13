const request = require('supertest');
const app = require('./app');

jest.mock('./services/documentService', () => {
    const uuidKey= '123456789';
    const  s3Key= 'dataset/123456789.jpg';
    const uploadMockResult = { uuidKey: uuidKey, s3Key: s3Key};
    const  downloadMockResult = {mockField: "mock contents"};    
    return {    
    upload: jest.fn().mockResolvedValue(uploadMockResult),
    download: jest.fn().mockResolvedValue(downloadMockResult)
}});

jest.mock('./services/metadataService', () => {
    const uuidKey= '123456789';
    const  rawOcr= {pages: [{blocks: []}]}
    const uploadMockResult = { uuidKey: uuidKey, rawOcr: rawOcr};
    return {
    ocr: jest.fn().mockResolvedValue(uploadMockResult)
}}
);

const documentService = require('./services/documentService.js');
const metadataService = require('./services/metadataService.js');

describe('App', () => {

	beforeAll((done) => {
		uuidKey = '123456789';
		s3Key = 'dataset/123456789.jpg';
		server = app.listen(3000, () => {
			console.log('Server started on portdownload 3000');
			done();
		});
  	});

	afterAll((done) => {
		server.close(done);
	});

  	afterEach(() => {
		jest.clearAllMocks();    
	});


    describe('POST /documents/:id/ocr', () => {

      it('api should return 422 if ocr json has no pages field', async () => {        
        const uuidKey= '123456789';
        const  ocrJson= {}

		    const endpoint = `/documents/${uuidKey}/ocr`;
        const response = await request(app)
          .post(endpoint)
          .send(ocrJson)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(422); // expect 422 - Unprocessable Entity
      });

      it('api should return 422 if ocr json pages field is empty', async () => {        
        const uuidKey= '123456789';
        const  ocrJson= {pages: []}

		    const endpoint = `/documents/${uuidKey}/ocr`;
        const response = await request(app)
          .post(endpoint)
          .send(ocrJson)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(422); // expect 422 - Unprocessable Entity 
      });

      it('api should return 422 if any ocr json page doenst have blocks field', async () => {        
        const uuidKey= '123456789';
        const  ocrJson= {pages: [{}]}

		    const endpoint = `/documents/${uuidKey}/ocr`;
        const response = await request(app)
          .post(endpoint)
          .send(ocrJson)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(422); // expect 422 - Unprocessable Entity
      });

      it('api should return 200 if ocr json is valid', async () => {        
        const uuidKey= '123456789';
        const  ocrJson= {pages: [{blocks: []}]}
        const ocrMockResult = { uuidKey: uuidKey, rawOcr: ocrJson};

		    const endpoint = `/documents/${uuidKey}/ocr`;
        const response = await request(app)
          .post(endpoint)
          .send(ocrJson)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200); // expect 200 - OK 

          expect(metadataService.ocr).toHaveBeenCalledTimes(1);
          expect(metadataService.ocr).toHaveBeenCalledWith(uuidKey, ocrJson);
          expect(response.body).toEqual(ocrMockResult);
      });

      

    });

  });
