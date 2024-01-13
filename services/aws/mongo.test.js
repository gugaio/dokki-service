// @/mongo.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongo = require('./mongo');

describe('Mongo Test', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start()
        const mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    it('insert & get document successfully', async () => {
        const uuid = '123';
        const originalName = 'test';
        const s3FilePath = 'test/path';
        const savedDocument = await mongo.document.insert(uuid, originalName, s3FilePath);

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedDocument._id).toBeDefined();
        expect(savedDocument.uuid).toBe(uuid);
        expect(savedDocument.originalName).toBe(originalName);
        expect(savedDocument.S3Path).toBe(s3FilePath);

        const fetchedDocument = await mongo.document.get(uuid);
        expect(fetchedDocument.uuid).toBe(uuid);
    });

    it('tail documents successfully', async () => {
        const limit = 1;
        const documents = await mongo.document.tail(limit);

        // Should return at least one document
        expect(documents.length).toBeGreaterThanOrEqual(1);
    });

    it('insert & get ocr successfully', async () => {
        const uuid = '123';
        const rawOcr = 'test';
        const savedOcr = await mongo.ocr.insert(uuid, rawOcr);

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedOcr._id).toBeDefined();
        expect(savedOcr.uuid).toBe(uuid);
        expect(savedOcr.rawOcr).toBe(rawOcr);

        const fetchedOcr = await mongo.ocr.get(uuid);
        expect(fetchedOcr.uuid).toBe(uuid);
    });

    it('update ocr mistakes successfully', async () => {
        const uuid = '123';
        const rawOcr = 'test';
        const mistakes = 'a=xxx';

        const savedOcr = await mongo.ocr.insert(uuid, rawOcr);
        await mongo.ocr.updateMistakes(uuid, mistakes);

        // Object Id should be defined when successfully saved to MongoDB.
        const fetchedOcr = await mongo.ocr.get(uuid);
        expect(fetchedOcr.uuid).toBe(uuid);
        expect(fetchedOcr.mistakes).toBe(mistakes);
    });

    it('update ocr rawOcr successfully', async () => {

        const uuid = '123';
        const rawOcr = 'test1';
        const rawOcr2 = 'test2';

        await mongo.ocr.insert(uuid, rawOcr);
        await mongo.ocr.findOneAndUpdate(uuid, rawOcr2);

        // Object Id should be defined when successfully saved to MongoDB.
        const fetchedOcr = await mongo.ocr.get(uuid);
        expect(fetchedOcr.uuid).toBe(uuid);
        expect(fetchedOcr.rawOcr).toBe(rawOcr2);
    });

    // Cleanup the tests
    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});