export const generateVerificationToken = (length = 6) => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let verificationCode = '';
    for(let i = 0; i < length; i++) {
        const randomIdex = Math.floor(Math.random() + characters.length);
        verificationCode += randomIdex;
    }
    return verificationCode;
} 
