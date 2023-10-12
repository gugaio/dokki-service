// app.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const s3 = require('./s3');
const uuid = require('uuid').v4;


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
    console.log('Upload request received');
    const { buffer, originalname } = req.file;

    const agent = req.query.agent;
    const sender = req.query.sender;
    const originalNameExtension = originalname.split('.')[1];
    const uuidFile = uuid();        
    const key = `${agent}/${sender}/${uuidFile}.${originalNameExtension}`

    await s3.upload(buffer, key);
    res.json({uuid:uuidFile, key:key, fileUrl: `https://${process.env.BUCKET_NAME}.s3-us-west-2.amazonaws.com/${key}`});
});

app.get('/image', async (req, res) => {
    console.log('Dowload image request received');
    const agent = req.query.agent;
    const sender = req.query.sender;
    const filename = req.query.filename;
    s3.downloadImage(agent, sender, filename).then((data) => {
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
