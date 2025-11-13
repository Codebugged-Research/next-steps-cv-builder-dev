import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

let bucket;
mongoose.connection.once('open', () => {
    bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

const gridFSStorage = multer.memoryStorage();

const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Only PDF files are allowed"));
    }
};

const documentFileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Only PDF, DOC, and DOCX files are allowed"));
    }
};

const saveToGridFS = (req, res, next) => {
    if (!req.file || !bucket) {
        return next();
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const filename = req.user._id + '-' + uniqueSuffix + '-' + req.file.originalname;
    
    const uploadStream = bucket.openUploadStream(filename, {
        metadata: { uploadedBy: req.user._id }
    });

    uploadStream.end(req.file.buffer);
    
    uploadStream.on('finish', () => {
        req.file.gridfsId = uploadStream.id;
        req.file.gridfsFilename = filename;
        next();
    });

    uploadStream.on('error', (error) => {
        next(error);
    });
};

const upload = multer({ 
    storage: gridFSStorage,
    fileFilter: documentFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadPDF = multer({ 
    storage: gridFSStorage,
    fileFilter: pdfFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export { upload, uploadPDF, saveToGridFS };