const documentService = require('../services/documentService');

const DEFAULT_LIMIT = 10;

const getDocuments = (req, res) => {
    try {
        const limit = req.query.total || DEFAULT_LIMIT;
        console.log(`Dowload last ${limit} documents`);
        documentService.tail(limit).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send(err);
        });    
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    getDocuments
};
