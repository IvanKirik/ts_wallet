import {CreateIncomeExpense} from "./createIncomeExpense";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Operations} from "../services/operations";
import {OperationsType} from "../type/operations.type";
import {DefaultResponseType} from "../type/default-response.type";

export class ChangeIncomeExpense {
    readonly title: HTMLElement | null;
    readonly buttonClose: HTMLElement | null;
    readonly buttonCreate: HTMLElement | null;
    readonly type: string;
    readonly typeInputSelect: HTMLElement | null;
    readonly inputs: NodeListOf<Element>;

    constructor(title: string, type: string) {
        const that: ChangeIncomeExpense = this;
        this.title = document.getElementById('title-create');
        if (this.title)
            this.title.innerText = title;
        this.buttonClose = document.getElementById('cancel');
        if (this.buttonClose)
            this.buttonClose.addEventListener('click', function () {
                location.href = '#/sidebar/income_expenses';
            })
        this.buttonCreate = document.getElementById('create');
        if (this.buttonCreate) {
            this.buttonCreate.innerText = 'Сохранить';
            this.buttonCreate.addEventListener('click', function () {
                ChangeIncomeExpense.changeOperation();
            })
        }
        this.type = type;
        this.typeInputSelect = document.getElementById('type');
        if (this.typeInputSelect) {
            (this.typeInputSelect as HTMLInputElement).value = type;
            if ((this.typeInputSelect as HTMLInputElement).value === '1') {
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

        this.inputs = document.querySelectorAll('.input')
        this.getChange();
    }

    public getChange(): void {
        let category: string | null = localStorage.getItem('category');
        if(category) {
            let categoryObject = JSON.parse(category);
            (this.inputs[2] as HTMLInputElement).value = categoryObject.amount;
            (this.inputs[3] as HTMLInputElement) = categoryObject.date;
            (this.inputs[4] as HTMLInputElement) = categoryObject.comment;
        }

    }

    private static async changeOperation(): Promise<void> {
        const id: string | null = localStorage.getItem('category');
        if(id) {
            let idValue = JSON.parse(id).id;
            let form: HTMLElement | null = document.getElementById('form');
            if(form) {
                let formData: FormData = new FormData(form as HTMLFormElement);
                const values: any = Object.fromEntries(formData.entries());
                try {
                    const result: OperationsType[] | DefaultResponseType = await CustomHttp.request(config.host + '/operations/' + idValue, 'PUT', {
                        type: values.type === '1' ? 'income' : 'expense',
                        amount: parseInt(values.sum),
                        date: values.date,
                        comment: values.comment,
                        category_id: parseInt(values.category),
                    });
                    if (result) {
                        Operations.updateBalance();
                        if ((result as DefaultResponseType).error) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                        location.href = '#/sidebar/income_expenses';
                    }
                } catch (error) {
                    console.log(error);
                    return
                }
            }


        }

    }

}