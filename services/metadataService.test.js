const metadataService = require('./metadataService');

jest.mock('../infra/mongo', () => {
  const result = {uuid: '123', rawOcr: 'ocr'};
  return {ocr: {
    insert: jest.fn(() => result),
    get: jest.fn(),
    findOneAndUpdate: jest.fn(),
  }};
});


describe('OCR', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('insert new one', async () => {
    const uuidDoc = '123';
    const ocr = 'ocr';
    const expected = {uuid: uuidDoc, rawOcr: ocr};

    const newOcr = await metadataService.ocr(uuidDoc, ocr);
    expect(newOcr).toEqual(expected);
  });
});
