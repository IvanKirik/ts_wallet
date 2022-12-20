import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Operations} from "../services/operations";
import {CategoriesResponseType} from "../type/categories-response.type";
import {DefaultResponseType} from "../type/default-response.type";

export class CreateIncomeExpense {
    readonly title: HTMLElement | null;
    readonly buttonCreate: HTMLElement | null;
    readonly buttonClose: HTMLElement | null;
    readonly typeInputSelect: HTMLElement | null;
    private static data: any;

    constructor(title: string, type: string) {
        this.title = document.getElementById('title-create');
        if(this.title)
        this.title.innerText = title;
        this.buttonCreate = document.getElementById('create');
        const that: CreateIncomeExpense = this;
        if(this.buttonCreate)
        this.buttonCreate.addEventListener('click', function () {
            CreateIncomeExpense.setCategoryIncomeExpense();
        })
        this.buttonClose = document.getElementById('cancel');
        if(this.buttonClose)
        this.buttonClose.addEventListener('click', function () {
            location.href = '#/sidebar/income_expenses';
        })
        this.typeInputSelect = document.getElementById('type');
        if(this.typeInputSelect) {
            (this.typeInputSelect as HTMLInputElement).value = type;
            if((this.typeInputSelect as HTMLInputElement).value === '1') {
                CreateIncomeExpense.getCategory('income')
            } else {
                CreateIncomeExpense.getCategory('expense');
            }
            this.typeInputSelect.addEventListener('change', function () {
                if ((that.typeInputSelect as HTMLInputElement).value === '1') {
                    CreateIncomeExpense.getCategory('income')
                } else {
                    CreateIncomeExpense.getCategory('expense');
                }
            })
        }
    }

    public static async getCategory(type: string): Promise<void> {
        try {
            const result: CategoriesResponseType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + type);
            if (result) {
                this.data = result;
                this.setOptionSelect();
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }
        } catch (error) {
            console.log(error);
            return
        }
    }

    private static setOptionSelect(): void {
        const selectElement: HTMLElement | null = document.getElementById('select');
        if(selectElement) {
            Array.from(selectElement.children).forEach(item => {
                item.remove();
            })
        }
        this.data.forEach((item: CategoriesResponseType) => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', String(item.id));
            optionElement.innerText = item.title;
            if(selectElement)
            selectElement.appendChild(optionElement);
        })

        let category: string | null = localStorage.getItem('category');
        if(category) {
            let categoryObject = JSON.parse(category);
            if(selectElement)
            Array.from(selectElement.children).forEach((item: any) => {
                if((item).innerText === categoryObject.category) {
                    (selectElement as HTMLInputElement).value = item.value;
                }
            })

        }
    }

    private static async setCategoryIncomeExpense(): Promise<void> {
        const form: HTMLElement | null = document.getElementById('form');
        if(form) {
            const formData: FormData = new FormData(form as HTMLFormElement);
            const values: any = Object.fromEntries(formData.entries());
            if(values) {
                try {
                    const result = await CustomHttp.request(config.host + '/operations', 'POST', {
                        type: values.type === '1' ? 'income':'expense',
                        amount: values.sum,
                        date: values.date,
                        comment: values.comment,
                        category_id: parseInt(values.category),
                    });
                    if (result) {
                        form.onreset;
                        location.href = '#/sidebar/income_expenses';
                        Operations.updateBalance();
                        if (result.error) {
                            throw new Error(result.error);
                        }
                    }
                } catch (error) {
                    console.log(error);
                    return
                }
            }
        }

    }
}