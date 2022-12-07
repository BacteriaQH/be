import User from '../models/user.model.js';

export const createUser = async ({ email, password, dob, name, isMale, address }) => {
    try {
        const user = User.create({ email, password, dob, name, isMale, address });
        return user;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const checkEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const findUser = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (err) {
        console.log(err);
        return false;
    }
};
