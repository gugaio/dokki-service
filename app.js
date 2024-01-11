const express = require('express');
const multer = require('multer');
const cors = require('cors');

const connect = require('./db/conn');

const { Document } = require('./business/models');

const logger = require('./logger');

const documentService = require('./services/documentService');
const metadataService = require('./services/metadataService');

const services = {
    document: documentService,
    metadata: metadataService
};

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_LAST_N = 10;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_SERVER_ERROR = 500;


// MULTER CONFIG: to get file photos to temp server storage
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({storage: storage, fileFilter: fileFilter});

// ROUTES
app.post('/documents', upload.single('file'), async (req, res) => {
    if (!req.file) {
	    logger.warn('No file uploadmetadataServiceed');
        res.status(HTTP_CODE_BAD_REQUEST).json({error: 'No file uploaded'});
        return;
    }

    const { buffer, originalname } = req.file;
    logger.info(`Uploading ${originalname}`);

    services.document.upload(originalname, buffer).then((data) => {
	    console.log(`Upload request completed for ${originalname}. UUID: ${data.uuidKey}`);
        res.json({id: data.uuidKey, s3Key: data.s3Key});
    }).catch((err) => {
        logger.error(`Upload failed for ${originalname}. Original error: ${err}`);
        res.status(HTTP_CODE_BAD_REQUEST).json(err);
    });
});

app.get('/documents/', async (req, res) => {
    const n = req.query.n || DEFAULT_LAST_N;
    console.log(`Dowload last ${n} documents`);
    services.document.last(n).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.get('/documents/:id', async (req, res) => {
    const id  = req.params.id;
    console.log(`Dowload image request received for ${id}`);
    services.document.download(id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.post('/documents/:id/ocr', async (req, res) => {
    const uuidDoc  = req.params.id;
    const ocrJson = req.body;    
    services.metadata.ocr(uuidDoc, ocrJson).then((savedOcr) => {
        res.send(savedOcr);
    }).catch((err) => {
        res.json(err);
    });
});


/*

app.get('/dataset/ocrmistakes', async (req, res) => {
    downloaderService.listOcrMistakes().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.post('/labels/:id', async (req, res) => {
    const id  = req.params.id;    
    console.log(`Update type, OCR and labels for ${id}`);
    const jsonData = req.body;
    labelsService.updateOCR(id, jsonData.docType, jsonData.ocr, jsonData.labels, jsonData.textMistakes).then(() => {
        console.log('OK');
        res.send('OK');
    }).catch((err) => {
        console.log(err);
        res.json(err);
    });
});

app.get('/labels/:id', async (req, res) => {
    const id  = req.params.id;    
    console.log(`Get OCR and labels for ${id}`);
    const jsonData = req.body;
    labelsService.getLabels(id).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.get('/dataset/', async (req, res) => {
    downloaderService.listDataset().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});
*/


app.get('/ping', (req, res) => {
    res.send('pong');
});


module.exports = app;

if (require.main === module) {
    // If this module is run directly (not imported), start the server
    const port = process.env.PORT || 3000;

    connect(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`*** Server is running on port ${port}`);
          });
    })
    
  }
  
