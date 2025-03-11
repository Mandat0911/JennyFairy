export const tokenDTO = ( accessToken, refreshToken) => ({
    tokens: {
        accessToken,
        refreshToken,
    },
});

export const userDTO = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    accountId: user.accountId
});

export const accountDTO = (account) => ({
    id: account._id,
    email: account.email,
    isVerified: account.isVerified,
    lastLogin: account.lastLogin,
    userType: account.userType,
});

export const verificationDTO = (message) => ({
    success: true,
    message,
});

export const resendVerificationEmailDTO = (message) => ({
    success: true,
    message,
});

export const forgotPasswordDTO = (message) => ({
    success: true,
    message,
});

export const resetPasswordDTO = (message) => ({
    success: true,
    message,
});

export const logoutDTO = (message) => ({
    success: true,
    message,
});

export const refreshTokenDTO = (accessToken, message) => ({
    success: true,
    accessToken,
    message,
});
