import { Router } from 'express';
import {
  requestVirtualAccess,
  getUserAccessRequest,
  getAllAccessRequests,
  getPendingAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  getAccessRequestStats
} from '../controllers/virtualAccess.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/request').post(verifyJWT, requestVirtualAccess);
router.route('/my-requests').get(verifyJWT, getUserAccessRequest);
router.route('/all').get(verifyJWT, getAllAccessRequests);
router.route('/pending').get(verifyJWT, getPendingAccessRequests);
router.route('/stats').get(verifyJWT, getAccessRequestStats);
router.route('/:requestId/approve').put(verifyJWT, approveAccessRequest);
router.route('/:requestId/reject').put(verifyJWT, rejectAccessRequest);

export default router;