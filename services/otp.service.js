import OTP from '../models/otp.model.js';

export const createOTP = async (email, otp) => {
    try {
        const otpR = await OTP.create({ email, otp });
        return otpR ? 1 : 0;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const findOTPWithEmail = async (email) => {
    try {
        const otpR = await OTP.find({ email });
        return otpR;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const deleteOTP = async (email) => {
    try {
        await OTP.deleteMany({ email });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
