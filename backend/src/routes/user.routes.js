import {Router} from 'express';
import {registerUser,loginUser,getCurrentUser,logoutUser,acceptHIPAAagreement,getHIPAAstatus} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {uploadPhoto } from '../middlewares/s3.upload.middleware.js'
import { uploadFile } from '../controllers/file.controller.js';

const router = Router();
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.post("/accept-hipaa", verifyJWT, acceptHIPAAagreement);
router.get("/hipaa-status", verifyJWT, getHIPAAstatus);
router.post(
  "/documents/upload-document", 
  verifyJWT, 
  uploadPhoto.single('document'), 
  uploadFile
);
router.route('/logout').post(verifyJWT, logoutUser);

export default router;
