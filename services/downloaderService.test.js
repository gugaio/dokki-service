const downloaderService = require('./downloaderService');
const s3 = require('./aws/s3');
const dynamoDB = require('./aws/dynamo');

const MOCK_S3_FILEPATH = 'dataset/9999.jpg';
const MOCK_FILE_CONTENTS = 'file contents';

jest.mock('./aws/dynamo', () => {
  return { get: jest.fn().mockResolvedValue({S3Path: 'dataset/9999.jpg'})};
});

jest.mock('./aws/s3', () => {
  return { download: jest.fn().mockResolvedValue('file contents')};
});


describe('downloaderService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('downloadDocument', () => {
    it('should upload file and insert into dynamo', async () => {
      const KEY = 'adc83ea4-20f7-4ef5-a53a-51f35bda5979';
      
      let result = await downloaderService.downloadDocument(KEY);

      expect(dynamoDB.get).toHaveBeenCalledTimes(1);
      expect(dynamoDB.get).toHaveBeenCalledWith(KEY);
      expect(s3.download).toHaveBeenCalledTimes(1);
      expect(s3.download).toHaveBeenCalledWith(MOCK_S3_FILEPATH);      
      expect(result).toEqual(MOCK_FILE_CONTENTS);
    });
  });
});