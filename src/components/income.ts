import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Operations} from "../services/operations";
import {CategoriesResponseType} from "../type/categories-response.type";
import {DefaultResponseType} from "../type/default-response.type";

export class Income {
    readonly title: HTMLElement | null;
    readonly textModel: HTMLElement | null
    readonly addButton: HTMLElement | null;
    private income: any;

    constructor(title: string, link: string) {
        this.title = document.getElementById('title-category');
        if(this.title)
        this.title.innerText = title;
        this.textModel = document.getElementById('exampleModalLabel');
        if(this.textModel)
        this.textModel.innerText = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.';
        this.addButton = document.getElementById('add-category');
        if(this.addButton)
        this.addButton.setAttribute('href', link)
        this.getIncome();
    }

    private async getIncome(): Promise<void> {
        try {
            const result: CategoriesResponseType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                this.income = result;
                this.generationSample();
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }

            }
        } catch (error) {
            console.log(error);
            return
        }
    }

    private generationSample(): void {
        const items: HTMLElement | null = document.getElementById('income-items');
        this.income.forEach((item: CategoriesResponseType) => {
            const elementItem: HTMLElement | null = document.createElement('div');
            elementItem.className = 'income-item';
            elementItem.style.order = `${item.id}`;
            elementItem.setAttribute('id', `${item.id}`);
            const itemTitle: HTMLElement | null = document.createElement('h3');
            itemTitle.className = 'mb-3';
            itemTitle.innerText = `${item.title}`;
            const elementActions: HTMLElement | null = document.createElement('div');
            elementActions.className = 'action';
            const buttonRed: HTMLElement | null = document.createElement('button');
            buttonRed.className = 'redaction btn btn-primary text-white ';
            buttonRed.innerText = 'Редактировать';
            buttonRed.setAttribute('data-id', `${item.id}`);
            const buttonDel: HTMLElement | null = document.createElement('button');
            buttonDel.className = ' deleted btn btn-danger text-white ';
            buttonDel.innerText = 'Удалить';
            buttonDel.setAttribute('data-id', `${item.id}`);
            buttonDel.setAttribute('data-deleted', 'deleted');
            buttonDel.setAttribute('data-bs-toggle', 'modal');
            buttonDel.setAttribute('data-bs-target', '#exampleModal');
            elementItem.appendChild(itemTitle);
            elementItem.appendChild(elementActions);
            elementActions.appendChild(buttonRed);
            elementActions.appendChild(buttonDel);
            if(items)
            items.appendChild(elementItem);
        })
        Income.deleted('/categories/income/');
        this.routeRedaction();
    }

    public static deleted (path: string): void {
        const buttonDeleted = Array.from(document.querySelectorAll('.deleted'));
        const buttonDelete = document.getElementById('delete');
        let id: string | null;
        let elementRemove: HTMLElement | null;
        buttonDeleted.forEach((item: any) => {
            item.addEventListener('click', function () {
                id = item.getAttribute('data-id');
                elementRemove = item.parentElement.parentElement;
            })
        })
        if(buttonDelete)
        buttonDelete.addEventListener('click', function () {
            try {
                const result: any = CustomHttp.request(config.host + path + id, 'DELETE');
                if (result) {
                    if(elementRemove)
                    elementRemove.remove();
                    Operations.updateBalance();
                    if (result.message) {
                        throw new Error(result.error);
                    }
                }
            } catch (error) {
                console.log(error);
                return;
            }
        })
    }

    private routeRedaction(): void {
        let buttons: HTMLElement[] = Array.from(document.querySelectorAll('.redaction'));
        buttons.forEach((item: HTMLElement) => {
            item.onclick = function () {
                localStorage.setItem('redaction-category', (item.getAttribute('data-id')!));
                localStorage.setItem('title-category', ((item.parentElement?.previousElementSibling) as HTMLElement).innerText);
                location.href = '#/sidebar/redaction_category_income';
            }
        })
    }

}
