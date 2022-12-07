import CryptoJS from 'crypto-js';

import { getIO } from '../index.js';
import { createQRCode, getQRCode } from '../services/qrcode.service.js';

import { deobfuscate, generateRandomString, obfuscate } from '../utils/random.js';
import { generateQRCode } from '../utils/qrcode.js';
import { getAgent } from '../utils/getAgent.js';
import { getSocketID } from '../utils/getSocketID.js';
import { findUser } from '../services/user.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

const preURL = `${process.env.SERVER_URL}/api/verify/qr`;

const secretKey = process.env.SECRET_KEY;

export const GenerateQRCodeController = async (req, res) => {
    //get socket id
    let io = getIO();
    console.log('io', io);
    let sID = getSocketID(io);
    console.log(sID);
    let agent = getAgent(req);
    // console.log('agentObject', agent);

    const timestamp = Date.now().toString();
    const randomStr = generateRandomString(timestamp.length);
    /**
     * obfuscate: merge alternate 2 string
     */
    const preM = obfuscate(timestamp, randomStr).join('');

    const m = `${preM}.${sID}`;

    const c = CryptoJS.AES.encrypt(m, secretKey).toString();
    const qrcodeS = await createQRCode(c, sID, {
        browser: { name: agent.browser.name, version: agent.browser.version },
        os: { name: agent.os.name, version: agent.os.version },
    });

    const url = `${preURL}?tk=${c}`;
    const qrcode = await generateQRCode(url);
    let timeout = setTimeout(() => {
        io.to(sID).emit('expired');
        clearTimeout(timeout);
    }, 30000);
    if (qrcodeS) return res.status(200).json({ code: 200, qrcode: qrcode, sID: sID });
};

export const VerifyQRCodeController = async (req, res) => {
    const io = getIO();

    const { tk, email } = req.body;
    const m = CryptoJS.AES.decrypt(tk, secretKey);
    const d = m.toString(CryptoJS.enc.Utf8);
    const [preM, sID] = d.split('.');

    const qrcode = await getQRCode(sID);
    //console.log(qrcode);
    /**
     * socket to client if the QR code is expired
     */
    const timestamp = Number(deobfuscate(preM));

    const now = new Date().getTime();
    //console.log(now - timestamp);
    const { name, _id } = await findUser(email);
    if (now - timestamp < 300000) {
        io.to(sID).emit('verified', { name, _id });
        return res.status(200).json({ userAgent: qrcode.userAgent, sID });
    }
};
export const LoginQRCodeController = async (req, res) => {
    const io = getIO();
    const { email, sID } = req.body;

    const user = await findUser(email);
    const { password, ...orther } = user._doc;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    io.to(sID).emit('login-success', { accessToken, refreshToken, user: { ...orther } });

    return res.status(200).json({ code: 200, message: 'Login success' });
};
