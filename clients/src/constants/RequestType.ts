export type loginRequest = {
    username: string,
    password: string
}

export type changePasswordRequest = {
    currentPassword: string,
    newPassword: string
}