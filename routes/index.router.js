import express from 'express';
const router = express.Router();

import {
    CheckEmailController,
    Greeting,
    LoginWithPasswordController,
    RegisterController,
} from '../controllers/user.controller.js';
import { CreateOTPController, LoginWithOTPController, VerifyWithOTPController } from '../controllers/otp.controller.js';
import { verifyOTPMiddleware } from '../middlewares/verifyOTP.middleware.js';
import {
    GenerateQRCodeController,
    LoginQRCodeController,
    VerifyQRCodeController,
} from '../controllers/qrcode.controller.js';
import { DeleteFileController, UploadFileController } from '../controllers/file.controller.js';

const initWebRoutes = (app) => {
    /**
     * pre login
     */
    router.get('/hello', Greeting);
    router.post('/check/mail', CheckEmailController);
    router.post('/register', RegisterController);
    router.get('/file/upload', UploadFileController);
    router.get('/file/delete', DeleteFileController);
    /**
     * login
     */
    router.post('/login/password', LoginWithPasswordController);

    router.post('/generate/otp', CreateOTPController);
    router.get('/generate/qrcode', GenerateQRCodeController);

    router.post('/verify/otp', verifyOTPMiddleware, VerifyWithOTPController);
    router.post('/verify/qrcode', VerifyQRCodeController);

    router.post('/login/otp', verifyOTPMiddleware, LoginWithOTPController);
    router.post('/login/qrcode', LoginQRCodeController);

    return app.use('/api', router);
};

export default initWebRoutes;
