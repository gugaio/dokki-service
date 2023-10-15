const AWS = require('aws-sdk');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const TABLE_NAME = 'document';

AWS.config.update({ region: 'us-west-2', accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });

exports.insert = async (uuid, filepath) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      docid: uuid,
      filepath: filepath
    },
  };

  await docClient.put(params).promise();  
};

exports.get = async (uuid) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  console.log(`Getting ${uuid}`);
  const params = {
    TableName: TABLE_NAME,
    Key: {
      docid: uuid
    }
  };

  try {
    let result = await docClient.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error(`Error getting ${uuid}: ${error}`);
    throw error;
  }
};
