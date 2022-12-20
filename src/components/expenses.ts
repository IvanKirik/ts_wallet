import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Income} from "./income";
import {CategoriesResponseType} from "../type/categories-response.type";
import {DefaultResponseType} from "../type/default-response.type";

export class Expenses {
    readonly title: HTMLElement | null;
    readonly textModel: HTMLElement | null;
    readonly addButton: HTMLElement | null;
    private expenses: any;

    constructor(title: string, link: string) {
        this.title = document.getElementById('title-category');
        if(this.title)
        this.title.innerText = title;
        this.textModel = document.getElementById('exampleModalLabel');
        if(this.textModel)
        this.textModel.innerText = 'Вы действительно хотите удалить категорию? Связанные расходы будут удалены навсегда.';
        this.addButton = document.getElementById('add-category');
        if(this.addButton)
        this.addButton.setAttribute('href', link)

        this.getExpenses();
    }

    private async getExpenses(): Promise<void> {
        try {
            const result: CategoriesResponseType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/expense');
            if (result) {
                this.expenses = result;
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
        const incomeItems: HTMLElement | null = document.getElementById('income-items');
        this.expenses.forEach((item: CategoriesResponseType) => {
            const incomeElementItem: HTMLElement | null = document.createElement('div');
            incomeElementItem.className = 'income-item';
            incomeElementItem.style.order = `${item.id}`;
            incomeElementItem.setAttribute('id', `${item.id}`);
            const incomeItemTitle: HTMLElement | null = document.createElement('h3');
            incomeItemTitle.className = 'mb-3';
            incomeItemTitle.innerText = `${item.title}`;
            const incomeElementActions: HTMLElement | null = document.createElement('div');
            incomeElementActions.className = 'action';
            const buttonRedactions: HTMLElement | null = document.createElement('button');
            buttonRedactions.className = 'redaction btn btn-primary text-white ';
            buttonRedactions.innerText = 'Редактировать';
            buttonRedactions.setAttribute('data-id', `${item.id}`);
            const buttonDelete: HTMLElement | null = document.createElement('button');
            buttonDelete.className = ' deleted btn btn-danger text-white ';
            buttonDelete.innerText = 'Удалить';
            buttonDelete.setAttribute('data-id', `${item.id}`);
            buttonDelete.setAttribute('data-deleted', 'deleted');
            buttonDelete.setAttribute('data-bs-toggle', 'modal');
            buttonDelete.setAttribute('data-bs-target', '#exampleModal');
            incomeElementItem.appendChild(incomeItemTitle);
            incomeElementItem.appendChild(incomeElementActions);
            incomeElementActions.appendChild(buttonRedactions);
            incomeElementActions.appendChild(buttonDelete);
            if(incomeItems)
            incomeItems.appendChild(incomeElementItem);
        })
        Income.deleted('/categories/expense/');
        this.routeRedaction();
    }

    private routeRedaction(): void {
        let buttons: HTMLElement[] = Array.from(document.querySelectorAll('.redaction'));
        buttons.forEach((item: HTMLElement) => {
            item.onclick = function () {
                    localStorage.setItem('redaction-category', item.getAttribute('data-id')!);
                    localStorage.setItem('title-category', ((item.parentElement?.previousElementSibling) as HTMLElement).innerText);
                    location.href = '#/sidebar/redaction_category_expense';

            }
        })
    }
}
