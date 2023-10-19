const AWS = require('aws-sdk');
const dynamo = require('./dynamo');
const uuid = require('uuid');

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const FAKE_ITEM = {docid: 'adc83ea4-20f7-4ef5-a53a-51f35bda5979', S3Path: 'path.jpg'};

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockReturnValue({
        put: jest.fn().mockReturnThis(),
        get: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({
          Item: FAKE_ITEM,
        }),
      }),
    },
    config: { update: jest.fn() }
  };
});


describe('dynamo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insert', () => {
    it('should insert key into table', async () => {
      const FILEPATH = `path.jpg`;

      const expectedParams = {
        TableName: 'document',
        Item: {docid: FAKE_ITEM.id, S3Path: FILEPATH}
      };
      
      await dynamo.insert(FAKE_ITEM.id, FILEPATH);

      expect(AWS.DynamoDB.DocumentClient).toHaveBeenCalledTimes(1);
      expect(AWS.DynamoDB.DocumentClient().put).toHaveBeenCalledTimes(1);
      expect(AWS.DynamoDB.DocumentClient().put).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('get', () => {
    it('should get Item', async () => {
      
      const expectedParams = {
        TableName: 'document',
        Key: {
          docid: FAKE_ITEM.id
        }
      };
      
      let result = await dynamo.get(FAKE_ITEM.id);

      expect(AWS.DynamoDB.DocumentClient).toHaveBeenCalledTimes(1);
      expect(AWS.DynamoDB.DocumentClient().get).toHaveBeenCalledTimes(1);
      expect(AWS.DynamoDB.DocumentClient().get).toHaveBeenCalledWith(expectedParams);
      expect(result).toEqual(FAKE_ITEM);
    });
  });

  it('should update OCR and labels for a document', async () => {
    const docid = 'example_docid';
    const ocr = 'example_ocr';
    const labels = ['example_label1', 'example_label2'];
    const updateMock = jest.fn().mockReturnValue({ promise: jest.fn() });
    AWS.DynamoDB.DocumentClient.mockImplementation(() => ({
      update: updateMock
    }));

    await dynamo.updateOCR(docid, ocr, labels);

    expect(AWS.DynamoDB.DocumentClient).toHaveBeenCalledTimes(1);
    expect(AWS.DynamoDB.DocumentClient).toHaveBeenCalledWith();
    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith({
      TableName: 'document',
      Key: {
        'docid': docid
      },
      UpdateExpression: 'SET ocr = :ocr, labels = :labels',
      ExpressionAttributeValues: {
        ':ocr': ocr,
        ':labels': labels
      }
    });
  });


});
