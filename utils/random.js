export const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const obfuscate = (a, b) => (a.length ? [a[0], ...obfuscate(b, a.slice(1))] : b);
export const deobfuscate = (cipher) => {
    const arr = cipher.split('').map((i) => {
        return Number(i);
    });
    return arr.toString().split(',NaN').join('').split(',').join('');
};
