// @/documentController.test.js
const supertest = require('supertest');
const app = require('../app'); // your express app
const documentService = require('../services/documentService');

jest.mock('../services/documentService');

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