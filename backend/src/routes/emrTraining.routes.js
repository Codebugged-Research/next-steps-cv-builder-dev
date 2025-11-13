import { Router } from 'express';
import {
  registerForTraining,
  getUserRegistrations,
  cancelRegistration,
  getAllRegistrations,
  confirmRegistration,
  rejectRegistration,
  markAsCompleted,
  getPendingRegistrations,
  getRegistrationStats,
  uploadCertificate,
  deleteCertificate
} from '../controllers/emrTraining.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { uploadCertificate as uploadCertificateMiddleware } from '../middlewares/s3.upload.middleware.js';
import { checkEmrTrainingLimit } from '../middlewares/registrationLimits.middleware.js';

const router = Router();

router.route('/').get(verifyJWT, getAllRegistrations);

router.route('/register').post(verifyJWT, checkEmrTrainingLimit, registerForTraining);

router.route('/my-registrations').get(verifyJWT, getUserRegistrations);

router.route('/pending-registrations').get(verifyJWT, getPendingRegistrations);

router.route('/stats').get(verifyJWT, getRegistrationStats);

router.route('/registrations/:registrationId').delete(verifyJWT, cancelRegistration);

router.route('/registrations/:registrationId/confirm').put(verifyJWT, confirmRegistration);

router.route('/registrations/:registrationId/reject').put(verifyJWT, rejectRegistration);

router.route('/registrations/:registrationId/complete').put(verifyJWT, markAsCompleted);

router.route('/registrations/:registrationId/certificate').post(verifyJWT, uploadCertificateMiddleware.single('certificate'), uploadCertificate);

router.route('/registrations/:registrationId/certificate').delete(verifyJWT, deleteCertificate);

export default router;