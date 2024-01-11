const documentService = require('./documentService');
const s3 = require('./aws/s3');
const { Document } = require('../business/models');
const mongo = require('./aws/mongo');

const uuid = require('uuid');

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('./aws/s3', () => {
  return {
    upload: jest.fn(),
    download: jest.fn(() => 'file buffer contents')
  }});

jest.mock('./aws/mongo', () => {
  const documentData = { S3Path: "dataset/adc83ea4-20f7-4ef5-a53a-51f35bda5979.jpg"};
  return { 
    insert: jest.fn(),
    get: jest.fn(() => documentData)
  };
});

describe('uploaderService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload file and insert into dynamo', async () => {

      const MOCK_UUID_KEY = 'adc83ea4-20f7-4ef5-a53a-51f35bda5979';
      uuid.v4.mockReturnValue(MOCK_UUID_KEY);

      const FILEPATH = 'originalFileName.jpg';
      const BUFFER = 'file buffer contents';
      const CONTENT_TYPE = 'image/jpg';
      const PREFIX = 'dataset';      
      
      const EXPECTED_S3_KEY = `${PREFIX}/${MOCK_UUID_KEY}.jpg`;
      const EXPECTED_RESULT =  {"uuidKey": MOCK_UUID_KEY, "s3Key": `${PREFIX}/${MOCK_UUID_KEY}.jpg`};

      let result = await documentService.upload(FILEPATH, BUFFER, PREFIX);

      expect(s3.upload).toHaveBeenCalledTimes(1);
      expect(s3.upload).toHaveBeenCalledWith(EXPECTED_S3_KEY, BUFFER, CONTENT_TYPE);
      expect(mongo.insert).toHaveBeenCalledTimes(1);
      expect(mongo.insert).toHaveBeenCalledWith(MOCK_UUID_KEY, FILEPATH, EXPECTED_S3_KEY);
      expect(result).toEqual(EXPECTED_RESULT);
    });
  });



  describe('download', () => {
    it('should download file from S3', async () => {
      const MOCK_S3_KEY = 'dataset/adc83ea4-20f7-4ef5-a53a-51f35bda5979.jpg';
      const EXPECTED_BUFFER = 'file buffer contents';

      const result = await documentService.download(MOCK_S3_KEY);

      expect(s3.download).toHaveBeenCalledTimes(1);
      expect(s3.download).toHaveBeenCalledWith(MOCK_S3_KEY);
      expect(mongo.get).toHaveBeenCalledTimes(1);
      expect(mongo.get).toHaveBeenCalledWith(MOCK_S3_KEY);
      expect(result).toEqual(EXPECTED_BUFFER);
    });
  });

});
