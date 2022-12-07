import QRCode from '../models/qrcode.model.js';

export const createQRCode = async (cipher, socketId, userAgent) => {
    try {
        const qrcode = await QRCode.create({ cipher, socketId, userAgent });
        return qrcode ? 1 : 0;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getQRCode = async (socketId) => {
    try {
        const qrcode = await QRCode.findOne({ socketId });
        return qrcode;
    } catch (error) {
        console.error(error);
        return false;
    }
};
