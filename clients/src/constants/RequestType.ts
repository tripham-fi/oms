export type loginRequest = {
    username: string,
    password: string
}

export type changePasswordRequest = {
    currentPassword: string,
    newPassword: string
}

export type createUserRequest = {
    firstName: string,
    lastName: string,
    role: string,
    email: string,
    dob: Date
}