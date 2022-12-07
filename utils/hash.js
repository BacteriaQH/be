import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

export const hash = async (password) => {
    return await bcrypt.hash(password, salt);
};

export const compare = async (password, hash) => {
    let result = await bcrypt.compare(password, hash);
    return result;
};
