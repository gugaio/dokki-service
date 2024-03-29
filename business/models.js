// @/models.js
const mongoose = require('mongoose');
const datetimeService = require('../services/datetimeService');


const DocumentSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  S3Path: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  updateTime: {
    type: Date,
    default: datetimeService.currentDatetime
  },
});

const OcrSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
  rawOcr: {
    type: Object,
    required: true,
  },
  mistakes: {
    type: String,
    required: false,
  },
  updateTime: {
    type: Date,
    default: datetimeService.currentDatetime
  },
});

const Document = mongoose.model('Document', DocumentSchema);
const Ocr = mongoose.model('Ocr', OcrSchema);

module.exports = { Document, Ocr };