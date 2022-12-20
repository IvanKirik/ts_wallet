export type UserInfoType = {
    accessToken: string,
    refreshToken: string,
    route: string,
    userInfo: UserInfo
}
export type UserInfo = {
    name: string,
    lastName: string,
    email: string,
    userId: number
}