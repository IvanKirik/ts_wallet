import config from "../../config/config";
import {RefreshResponseType} from "../type/refresh-response.type";
import {LogoutResponseType} from "../type/logout-response.type";
import {UserInfoType} from "../type/user-info.type";

export class Auth {

    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfo: string = 'userInfo';

    static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: RefreshResponseType | null = await response.json();
                if (result && !result.error && result.refreshToken && result.accessToken) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        location.href = '#/';
        return false;
    }

    public static async logAut(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: LogoutResponseType | null = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfo);
                    return true;
                }
            }
        }
        return false;
    }

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    public static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static setUserInfo(info: { lastName: string; name: string; userId: number; email: string }): void {
        localStorage.setItem(this.userInfo, JSON.stringify(info));
    }
    static getUserInfo(): UserInfoType | null {
        const userInfo: string | null = localStorage.getItem(this.userInfo);
        if(userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}