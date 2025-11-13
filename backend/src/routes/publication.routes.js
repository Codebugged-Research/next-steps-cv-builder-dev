import { Router } from 'express';
import { 
  createPublication,
  getAllPublications,
  getPublicationById,
  getUserPublications,
  updatePublication,
  deletePublication,
  updateProjectStage,
  updateProjectName,
  getPublicationsByStage,
  uploadCertificate,
  deleteCertificate,
  getPublicationStats
} from '../controllers/publication.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { uploadCertificate as uploadCertificateMiddleware } from '../middlewares/s3.upload.middleware.js';

const router = Router();

router.route('/').get(getAllPublications);
router.route('/stats').get(getPublicationStats);
router.route('/stage/:stage').get(getPublicationsByStage);
router.route('/:id').get(getPublicationById);

router.route('/create').post(verifyJWT, createPublication);
router.route('/user/publications').get(verifyJWT, getUserPublications);
router.route('/:id').put(verifyJWT, updatePublication);
router.route('/:id').delete(verifyJWT, deletePublication);

router.route('/:id/projects/:projectId/stage').put(verifyJWT, updateProjectStage);
router.route('/:id/projects/:projectId/name').put(verifyJWT, updateProjectName);

router.route('/:id/certificate').post(verifyJWT, uploadCertificateMiddleware.single('certificate'), uploadCertificate);
router.route('/:id/certificate').delete(verifyJWT, deleteCertificate);

export default router;