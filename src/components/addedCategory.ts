import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {CategoriesResponseType} from "../type/categories-response.type";
import {DefaultResponseType} from "../type/default-response.type";

export class AddedCategory {
    readonly title: HTMLElement | null;
    readonly buttonIncomeCreate: HTMLElement | null;
    readonly buttonClose: HTMLElement | null;

    constructor(title: string) {
        this.title = document.getElementById('title-create-category');
        if(this.title)
        this.title.innerText = title;
        this.buttonIncomeCreate = document.getElementById('button-income-create');
        this.buttonClose = document.getElementById('button-income-create-remove');
        if(this.buttonClose)
        this.buttonClose.onclick = function () {
            window.history.back();
        }
        if(this.buttonIncomeCreate)
        this.buttonIncomeCreate.addEventListener('click', AddedCategory.addCategory);
    }

    private static async addCategory(): Promise<void> {
        let input: HTMLElement | null = document.getElementById('input-create-element');
        let route: string | null = localStorage.getItem('route');
        try {
            const result: CategoriesResponseType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + route, 'POST', {
                title: (input as HTMLInputElement).value,
            });

            if (result) {
                (input as HTMLInputElement).value = '';
                location.href = '#/sidebar/' + route;
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

            }
        } catch (error) {
            console.log(error);
            return;
        }
    }
}