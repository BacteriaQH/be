import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
    const access_token = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: '1h' },
    );
    return access_token;
};

export const generateRefreshToken = (user) => {
    const refresh_token = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: '365d' },
    );
    return refresh_token;
};
