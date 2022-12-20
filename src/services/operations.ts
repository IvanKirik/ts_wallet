import {CustomHttp} from "./custom-http";
import config from "../../config/config";

export class Operations{
    public static async updateBalance(): Promise<void> {
        let balance: HTMLElement | null = document.getElementById('balance');
        if(balance)
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                balance.innerText = `${result.balance}$`;
                if (result.error) {
                    throw new Error(result.error);
                }
            }
        } catch (error) {
            console.log(error);
            return;
        }
    }
}