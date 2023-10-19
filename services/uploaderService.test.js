const uploaderService = require('./uploaderService');
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
  return { insert: jest.fn()};
});

describe('uploaderService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload file and insert into dynamo', async () => {
      const FILEPATH = 'path.jpg';
      const BUFFER = 'file contents';
      const CONTENT_TYPE = 'image/jpg';
      const PREFIX = 'dataset';

      const MOCK_UUID_KEY = 'adc83ea4-20f7-4ef5-a53a-51f35bda5979';
      uuid.v4.mockReturnValue(MOCK_UUID_KEY);
      
      const EXPECTED_S3_KEY = `${PREFIX}/${MOCK_UUID_KEY}.jpg`;
      const EXPECTED_RESULT =  {"uuidKey": MOCK_UUID_KEY};

      let result = await uploaderService.upload(FILEPATH, BUFFER, PREFIX);

      expect(s3.upload).toHaveBeenCalledTimes(1);
      expect(s3.upload).toHaveBeenCalledWith(EXPECTED_S3_KEY, BUFFER, CONTENT_TYPE);
      expect(dynamoDB.insert).toHaveBeenCalledTimes(1);
      expect(dynamoDB.insert).toHaveBeenCalledWith(MOCK_UUID_KEY, FILEPATH, EXPECTED_S3_KEY);
      expect(result).toEqual(EXPECTED_RESULT);
    });
  });
});