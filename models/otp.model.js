import { Schema, model } from 'mongoose';

const otpSchema = new Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, expires: 150, default: Date.now },
});
otpSchema.index({ lastModifiedDate: 1 }, { expireAfterSeconds: 150 });
const OTP = model('OTP', otpSchema);

export default OTP;
