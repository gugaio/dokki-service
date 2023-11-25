// app.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');

const uploaderService = require('./services/uploaderService');
const downloaderService = require('./services/downloaderService');
const labelsService = require('./services/labelsService');


require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


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
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({error: 'No file uploaded'});
        return;
    }
    console.log(`Upload request received for ${req.file.originalname}`);
    const { buffer, originalname } = req.file;
    uploaderService.upload(originalname, buffer).then((data) => {
        res.json({id: data.uuidKey, s3Key: data.s3Key});
    }).catch((err) => {
        res.json(err);
    });
});

app.get('/download/:id', async (req, res) => {
    const id  = req.params.id;
    console.log(`Dowload image request received for ${id}`);
    downloaderService.downloadDocument(id).then((data) => {
        res.send(data);
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

app.get('/dataset/ocrmistakes', async (req, res) => {
    downloaderService.listOcrMistakes().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.get('/ping', (req, res) => {
    res.send('pong');
});


module.exports = app;

if (require.main === module) {
    // If this module is run directly (not imported), start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
  
