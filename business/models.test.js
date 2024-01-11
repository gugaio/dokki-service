// @/models.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Document, Ocr } = require('./models');

const mockCurrentTime = new Date('2022-01-01T00:00:00Z');
jest.mock('../services/datetimeService', () => ({
  currentDatetime: jest.fn(() => mockCurrentTime),
}));


describe('Document Model Test', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start()
        const mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    it('create & save document successfully', async () => {
        const documentData = new Document({ uuid: '123', originalName: 'test', S3Path: 'test/path'});
        const savedDocument = await documentData.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedDocument._id).toBeDefined();
        expect(savedDocument.uuid).toBe(documentData.uuid);
        expect(savedDocument.originalName).toBe(documentData.originalName);
        expect(savedDocument.S3Path).toBe(documentData.S3Path);
        expect(savedDocument.updateTime).toBe(documentData.updateTime);
        expect(savedDocument.updateTime).toStrictEqual(mockCurrentTime);
    });

    // Cleanup the tests
    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});



describe('Ocr Model Test', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start()
        const mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    it('create & save ocr without mistakes data successfully', async () => {
        const ocrData = new Ocr({ uuid: '123', rawOcr: 'test'});
        const savedOcr = await ocrData.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedOcr._id).toBeDefined();
        expect(savedOcr.uuid).toBe(ocrData.uuid);
        expect(savedOcr.rawOcr).toBe(ocrData.rawOcr);
        expect(savedOcr.mistakes).toBeUndefined();
        expect(savedOcr.updateTime).toBe(ocrData.updateTime);
        expect(savedOcr.updateTime).toStrictEqual(mockCurrentTime);

    });

    it('create & save ocr with mistakes data successfully', async () => {
        const ocrData = new Ocr({ uuid: '123', rawOcr: 'test', mistakes: 'test'});
        const savedOcr = await ocrData.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedOcr._id).toBeDefined();
        expect(savedOcr.uuid).toBe(ocrData.uuid);
        expect(savedOcr.rawOcr).toBe(ocrData.rawOcr);
        expect(savedOcr.mistakes).toBe(ocrData.mistakes);
        expect(savedOcr.updateTime).toBe(ocrData.updateTime);
        expect(savedOcr.updateTime).toStrictEqual(mockCurrentTime);
    }); 

    // Cleanup the tests
    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});