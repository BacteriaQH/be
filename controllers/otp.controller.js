import * as nodemailer from 'nodemailer';
import { generateOTP } from '../utils/otp.js';
import { hash } from '../utils/hash.js';

import { createOTP } from '../services/otp.service.js';
import { findUser } from '../services/user.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass,
    },
});

export const CreateOTPController = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP().toString();
    const hOTP = await hash(otp);

    const mailOptions = {
        from: user,
        to: email,
        subject: 'Sending OTP',
        text: otp,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(404).json({ code: 404, message: 'OTP not created' });
        } else {
            console.log('Email sent: ' + JSON.stringify(info));
        }
    });
    let result = await createOTP(email, hOTP);

    if (result) {
        return res.status(200).json({ code: 200, message: 'OTP created successfully' });
    } else {
        return res.status(404).json({ code: 404, message: 'OTP not created' });
    }
};

export const LoginWithOTPController = async (req, res) => {
    const { email } = req.body;
    const user = await findUser(email);
    if (!user) {
        return res.status(200).json({
            code: 404,
            message: 'User not found',
        });
    }
    if (user) {
        const { password, ...other } = user._doc;
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });
        return res.status(200).json({
            code: 200,
            message: 'Login success',
            user: {
                ...other,
            },
            accessToken,
        });
    }
};

export const VerifyWithOTPController = async (req, res) => {
    return res.status(200).json({ code: 200, message: 'Verify OTP success' });
};
