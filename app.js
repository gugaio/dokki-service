const express = require('express');
const cors = require('cors');
const router = require('./routers/router');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', router);
/*
app.post('/documents/:id/ocr', body('pages').isOcrJsonValid(), async (req, res) => {

    const validationErros = validationResult(req);
    if (!validationErros.isEmpty()) {
        const errors = validationErros.array();
        return res.status(HTTP_CODE_UNPROCESSABLE_ENTITY).json(errors);
    }

    const uuidDoc = req.params.id;
    const ocrJson = req.body;
    services.metadata.ocr(uuidDoc, ocrJson).then((savedOcr) => {
        res.send(savedOcr);
    }).catch((err) => {
        res.json(err);
    });
});
*/

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
