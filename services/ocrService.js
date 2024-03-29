const axios = require('axios');

async function ocr(s3Key) {    
    try {
        console.log(`Calling ocr for ${s3Key}`);
        const response = await axios.post('http://127.0.0.1:5000/ocr', JSON.stringify({ s3key: s3Key }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        return response.data;
    } catch (error) {
        console.error(' OCR error');
    }
}

module.exports = {
    ocr
  };
  