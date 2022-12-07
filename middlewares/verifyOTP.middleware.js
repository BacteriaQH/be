import { deleteOTP, findOTPWithEmail } from '../services/otp.service.js';
import { compare } from '../utils/hash.js';

export const verifyOTPMiddleware = async (req, res, next) => {
    const { email, otp } = req.body;
    const result = await findOTPWithEmail(email);
    if (!result.length) {
        return res.status(404).json({ code: 404, message: 'OTP expired' });
    }
    const lastOTP = result[result.length - 1];

    if (lastOTP && !compare(otp, lastOTP.otp)) {
        return res.status(401).json({ code: 401, message: 'OTP invalid' });
    }
    if (lastOTP && compare(otp, lastOTP.otp) && lastOTP.email === email) {
        const dOtp = await deleteOTP(email);
        if (dOtp) {
            next();
        }
    }
};
