import { Router } from 'express';
import { 
    createConference, 
    getAllConferences, 
    getConferenceById, 
    updateConference, 
    deleteConference,
    getUpcomingConferences,
    registerForConference,
    getUserRegistrations,
    cancelRegistration
} from '../controllers/conference.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { checkConferenceLimit } from '../middlewares/registrationLimits.middleware.js';

const router = Router();

router.route('/').get(getAllConferences);
router.route('/upcoming').get(getUpcomingConferences);
router.route('/registrations').get(verifyJWT, getUserRegistrations);
router.route('/create').post(verifyJWT, createConference);
router.route('/:id').get(getConferenceById);
router.route('/:id').put(verifyJWT, updateConference);
router.route('/:id').delete(verifyJWT, deleteConference);
router.route('/:id/register').post(verifyJWT, checkConferenceLimit, registerForConference);
router.route('/registrations/:registrationId').delete(verifyJWT, cancelRegistration);

export default router;