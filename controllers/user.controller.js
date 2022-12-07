import { createUser, checkEmail, findUser } from '../services/user.service.js';
import { hash, compare } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

export const Greeting = (req, res) => {
    return res.json('Hello World');
};

export const CheckEmailController = async (req, res) => {
    const { email } = req.body;

    const user = await checkEmail(email);

    if (!user) {
        return res.status(200).json({ code: 200, message: 'Email does not exist in our system' });
    } else {
        return res.status(409).json({ code: 409, message: 'Email already exists' });
    }
};

export const RegisterController = async (req, res) => {
    const { email, password, dob, name, isMale, address } = req.body;
    const hashPassword = await hash(password);

    const user = await createUser({ email, password: hashPassword, dob, name, isMale, address });
    if (user) {
        return res.status(200).json({ code: 200, message: 'Register successfully' });
    } else {
        return res.status(400).json({ code: 400, message: 'Register failed' });
    }
};

export const LoginWithPasswordController = async (req, res) => {
    const { email, password } = req.body;
    const user = await findUser(email);

    if (user) {
        let validPassword = await compare(password, user.password);
        if (validPassword) {
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
        } else {
            return res.status(404).json({
                code: 404,
                message: 'Password is incorrect',
            });
        }
    } else {
        return res.status(400).json({
            code: 400,
            message: 'User not found',
        });
    }
};
