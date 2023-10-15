const AWS = require('aws-sdk');
const s3 = require('./s3');

const uuid = require('uuid');

const FAKE_BODY = 'test';
const BUCKET = 'notas-dev-s3';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('aws-sdk', () => {
  const mS3 = { upload: jest.fn().mockReturnThis(), getObject: jest.fn().mockReturnThis(), promise: jest.fn().mockResolvedValue({
    Body: FAKE_BODY,
  }) };
  return { S3: jest.fn(() => mS3), config: { update: jest.fn() } };
});


describe('s3', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload a buffer to S3', async () => {
      const buffer = Buffer.from('test');
      const PREFIX = 'dataset';
      const MOCK_UUID_KEY = 'adc83ea4-20f7-4ef5-a53a-51f35bda5979';
      uuid.v4.mockReturnValue(MOCK_UUID_KEY);
      const S3_KEY = `${PREFIX}/${MOCK_UUID_KEY}.jpg`;      

      await s3.upload(S3_KEY, buffer);

      expect(AWS.S3).toHaveBeenCalledTimes(1);
      expect(AWS.S3().upload).toHaveBeenCalledTimes(1);

      const EXPECTED_S3_INPUT = {"Key": S3_KEY, "Body": buffer, "Bucket": BUCKET};
      expect(AWS.S3().upload).toHaveBeenCalledWith(EXPECTED_S3_INPUT);
    });
  });

  describe('download', () => {
    it('should download a file to S3', async () => {      
      const S3_KEY = `9999.jpg`;  

      let result = await s3.download(S3_KEY);

      expect(AWS.S3).toHaveBeenCalledTimes(1);
      expect(AWS.S3().getObject).toHaveBeenCalledTimes(1);
      expect(AWS.S3().getObject).toHaveBeenCalledWith({"Key": S3_KEY, "Bucket": BUCKET});

      expect(result).toEqual(FAKE_BODY);
    });
  });

});