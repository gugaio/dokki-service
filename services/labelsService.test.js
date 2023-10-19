const labelService = require('./labelsService');
const s3 = require('./aws/s3');
const dynamoDB = require('./aws/dynamo');

const uuid = require('uuid');

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('./aws/s3', () => {
  return { upload: jest.fn()};
});

jest.mock('./aws/dynamo', () => {
  return { insert: jest.fn(), updateOCR: jest.fn()};
});

describe('labelService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload file and insert into dynamo', async () => {
      const FILEPATH = 'path.jpg';
      const OCR = {};
      const LABELS = {};

      const MOCK_UUID_KEY = 'adc83ea4-20f7-4ef5-a53a-51f35bda5979';
      uuid.v4.mockReturnValue(MOCK_UUID_KEY);
      

      await labelService.updateOCR(MOCK_UUID_KEY, OCR, LABELS);

      expect(dynamoDB.updateOCR).toHaveBeenCalledTimes(1);
      expect(dynamoDB.updateOCR).toHaveBeenCalledWith(MOCK_UUID_KEY, OCR, LABELS);
    });
  });
});