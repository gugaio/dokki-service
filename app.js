// app.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const s3 = require('./services/aws/s3.js');
const db = require('./services/aws/dynamo.js');
const uuid = require('uuid').v4;

const uploaderService = require('./uploaderService.js');


require('dotenv').config();

const app = express();
app.use(cors());

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
    const { buffer, originalname } = req.file;
    uploaderService.upload(originalname, buffer).then((data) => {
        res.json({uuid: data.uuidKey});
    }).catch((err) => {
        res.json(err);
    });
});

app.get('/image/:uuid', async (req, res) => {
    const docId  = req.params.id;

    console.log(`Dowload image request received for ${key}`);


    s3.downloadImage(key).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.get('/download', async (req, res) => {
    console.log('Dowload request received');
    console.log(req.query);
    const agent = req.query.agent;
    const sender = req.query.sender;
    const uuidFile = req.query.uuid;
    s3.downloadJson(agent, sender, uuidFile).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
