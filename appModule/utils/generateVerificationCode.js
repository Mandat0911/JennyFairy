export const generateVerificationToken = (length = 6) => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let verificationCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters[randomIndex];
    }
    return verificationCode;
};
