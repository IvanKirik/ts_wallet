import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {CategoriesResponseType} from "../type/categories-response.type";
import {DefaultResponseType} from "../type/default-response.type";

export class RedactionCategory {
    readonly title: HTMLElement | null;
    readonly buttonClose: HTMLElement | null;
    readonly buttonRedaction: HTMLElement | null;
    readonly input: HTMLElement | null;

    constructor(title: string, path: string) {
        this.title = document.getElementById('redaction-category-title');
        if(this.title)
        this.title.innerText = title;
        this.buttonClose = document.getElementById('button-income-redaction-remove');
        if(this.buttonClose)
        this.buttonClose.onclick = function () {
            location.href = path;
        }
        this.buttonRedaction = document.getElementById('button-income-redaction');
        if(this.buttonRedaction)
        this.buttonRedaction.addEventListener('click', RedactionCategory.redactionCategory);
        this.input = document.getElementById('input-redaction-element');
        if(this.input)
            {
                (this.input as HTMLInputElement).value = localStorage.getItem('title-category')!;
            }
    }

    public static async redactionCategory(): Promise<void> {
        let route: string | null = localStorage.getItem('route')
        let id: string | null = localStorage.getItem('redaction-category');
        let input: HTMLElement | null = document.getElementById('input-redaction-element');
        if(input)
        try {
            const result: CategoriesResponseType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/'+ route + '/' + id, 'PUT', {
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
            return ;
        }
    }
}