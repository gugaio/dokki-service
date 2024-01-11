const AWS = require('aws-sdk');
const {upload, download, DEFAULT_BUCKET_NAME} = require('./s3');

const FAKE_BODY = 'test';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('aws-sdk', () => {
  const mockResult = {
    promise: jest.fn().mockResolvedValue({
      Body: FAKE_BODY,
    }) 
  }
  const S3Instance = { 
	  upload: jest.fn(() => mockResult), 
	  getObject: jest.fn(() => mockResult)
  };
  const MOCK_AWS_MODULE = { 
	  S3: jest.fn(() => S3Instance), 
	  config: { 
		  update: jest.fn() 
	  } 
  };
  return MOCK_AWS_MODULE;
});


describe('s3', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload a buffer using S3 upload with expected parameters', async () => {   
      const S3_KEY = `0000000.jpg`;
      const buffer = Buffer.from('test');
      const contentType = 'image/jpeg';
      const EXPECTED_S3_INPUT = {"Key": S3_KEY, "Body": buffer, "ContentType": contentType, "Bucket": DEFAULT_BUCKET_NAME};         

      await upload(S3_KEY, buffer, contentType);

      expect(AWS.S3().upload).toHaveBeenCalledTimes(1);      
      expect(AWS.S3().upload).toHaveBeenCalledWith(EXPECTED_S3_INPUT);
    });
  });

  describe('download', () => {
    it('it should return response Body from S3 download method', async () => {      
      const S3_KEY = `9999999.jpg`;  
      const EXPECTED_S3_INPUT = {"Key": S3_KEY, "Bucket": DEFAULT_BUCKET_NAME};  

      let result = await download(S3_KEY);

      expect(AWS.S3().getObject).toHaveBeenCalledTimes(1);
      expect(AWS.S3().getObject).toHaveBeenCalledWith(EXPECTED_S3_INPUT);
      expect(result).toEqual(FAKE_BODY);
    });
  });

});
