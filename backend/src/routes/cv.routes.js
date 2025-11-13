import { Router } from 'express';
import { createOrUpdateCV, getCV, uploadGovCV,downloadCVPDF} from '../controllers/cv.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { uploadPDF, saveToGridFS } from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/save').post(verifyJWT, createOrUpdateCV);
router.route('/download/:userId').get(verifyJWT, downloadCVPDF);
router.route('/:userId').get(verifyJWT, getCV);
router.route('/upload-gov-csv').post(
    verifyJWT,
    uploadPDF.single('govCV'),
    saveToGridFS,
    uploadGovCV
);

export default router;