import {Income} from "./income";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Home} from "./home";
import {CategoryRedactionType} from "../type/category-redaction.type";
import {OperationsType} from "../type/operations.type";
import {DefaultResponseType} from "../type/default-response.type";


export class IncomeExpense {
    public buttonInterval: HTMLElement | null;
    readonly title: HTMLElement | null;
    readonly textModel: HTMLElement | null;
    readonly createButtonIncome: HTMLElement | null;
    readonly createButtonExpense: HTMLElement | null;
    readonly buttonToday: HTMLElement | null;
    readonly buttonWeek: HTMLElement | null;
    readonly buttonMonth: HTMLElement | null;
    readonly buttonYear: HTMLElement | null;
    readonly buttonAll: HTMLElement | null;
    private date: any;
    private dateIncomeExpense: any;

    constructor(title: string) {
        this.title = document.getElementById('title-expense-income');
        if(this.title)
        this.title.innerText = title;
        this.textModel = document.getElementById('exampleModalLabel');
        if(this.textModel)
        this.textModel.innerText = 'Вы действительно хотите удалить операцию?';
        this.createButtonIncome = document.getElementById('create-income');
        if(this.createButtonIncome)
        this.createButtonIncome.addEventListener('click', function () {
            localStorage.removeItem('category');
            location.href = '#/sidebar/create/income';
        })
        this.createButtonExpense = document.getElementById('create-expense');
        if(this.createButtonExpense)
        this.createButtonExpense.addEventListener('click', function () {
            localStorage.removeItem('category');
            location.href = '#/sidebar/create/expense';
        })

        this.dateIncomeExpense = null;
        const that: IncomeExpense = this;
        this.init('?period=all');
        this.buttonToday = document.getElementById('btn-today');
        if(this.buttonToday)
        this.buttonToday.addEventListener('click', function () {
            that.init('?period=""');
        })
        this.buttonWeek = document.getElementById('btn-week');
        if(this.buttonWeek)
        this.buttonWeek.addEventListener('click', function () {
            that.init('?period=month');
        })

        this.buttonMonth = document.getElementById('btn-month');
        if(this.buttonMonth)
        this.buttonMonth.addEventListener('click', function () {
            that.init('?period=month');
        })
        this.buttonYear = document.getElementById('btn-year');
        if(this.buttonYear)
        this.buttonYear.addEventListener('click', function () {
            that.init('?period=year')
        })
        this.buttonAll = document.getElementById('btn-all');
        if(this.buttonAll)
        this.buttonAll.addEventListener('click', function () {
            that.init('?period=all');
        })
        this.buttonInterval = document.getElementById('btn-interval');
        this.date = Array.from(document.querySelectorAll('.input-interval'));
        if(this.buttonInterval)
        this.buttonInterval.addEventListener('click', function () {
            that.date.forEach((item: HTMLInputElement) => {
                if(!item.value) {
                    item.classList.add('placeholder-red')
                }
            })
        })
        this.date[1].addEventListener('change', function () {
            if(that.date[0].value && that.date[1].value) {
                that.init(`?period=interval&dateFrom=${that.date[0].value}&dateTo=${that.date[1].value}`);
            }
        })
        this.date[0].addEventListener('change', function () {
            if(that.date[0].value && that.date[1].value) {
                that.init(`?period=interval&dateFrom=${that.date[0].value}&dateTo=${that.date[1].value}`);
            }
        })
        Home.activeButton();
    }

    private async init(period: string): Promise<void> {
        try {
            const result: OperationsType[] | DefaultResponseType = await CustomHttp.request(config.host + '/operations' + period);
            if (result) {
                this.dateIncomeExpense = result;
                this.create();
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }
        } catch (error) {
           console.log(error);
            return;
        }
    }

    private create(): void {
        const tableElement: HTMLElement | null = document.getElementById('table-body');
        if(tableElement)
        this.remove(tableElement);
        this.dateIncomeExpense.forEach((item: any, index: number) => {
            const trElement: HTMLElement | null = document.createElement('tr');
            trElement.setAttribute('id', item.id);
            const tdElementNumber: HTMLElement | null = document.createElement('td');
            tdElementNumber.innerText = (index + 1).toString();
            const tdElementType: HTMLElement | null = document.createElement('td');
            tdElementType.innerText = item.type === 'income' ? 'Доход' : 'Расход';
            tdElementType.style.color = item.type === 'income' ? 'green' : 'red';
            const tdElementCategory: HTMLElement | null = document.createElement('td');
            tdElementCategory.innerText = item.category ? item.category : 'Не определено';
            const tdElementAmount: HTMLElement | null = document.createElement('td');
            tdElementAmount.innerText = item.amount;
            const tdElementDate: HTMLElement | null = document.createElement('td');
            tdElementDate.innerText = item.date;
            const tdElementComment: HTMLElement | null = document.createElement('td');
            tdElementComment.className = 'comment';
            tdElementComment.innerText = item.comment;
            const tdRedactionComponent: HTMLElement | null = document.createElement('td');
            tdRedactionComponent.className = 'redaction-operation';
            const imgDelete: HTMLElement | null = document.createElement('img');
            imgDelete.className = 'deleted';
            imgDelete.setAttribute('src', '../../static/svg/trash.svg');
            imgDelete.setAttribute('data-bs-toggle', 'modal');
            imgDelete.setAttribute('data-bs-target', '#exampleModal');
            imgDelete.setAttribute('data-id', `${item.id}`);
            const imgRedaction: HTMLElement | null = document.createElement('img');
            imgRedaction.className = 'redaction-element';
            imgRedaction.setAttribute('src', '../../static/svg/pen.svg');
            trElement.appendChild(tdElementNumber);
            trElement.appendChild(tdElementType);
            trElement.appendChild(tdElementCategory);
            trElement.appendChild(tdElementAmount);
            trElement.appendChild(tdElementDate);
            trElement.appendChild(tdElementComment);
            tdRedactionComponent.appendChild(imgDelete);
            tdRedactionComponent.appendChild(imgRedaction);
            trElement.appendChild(tdRedactionComponent);
            if(tableElement)
            tableElement.appendChild(trElement);
        })
        Income.deleted('/operations/')
        this.redactionOperation();
    }

    private remove(element: HTMLElement): void {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    private redactionOperation(): void {
        let redactionButton: NodeList | null = document.querySelectorAll('.redaction-element');
        redactionButton.forEach((item: any) => {
            item.addEventListener('click', function () {
                let category: CategoryRedactionType = {
                    id: item.parentElement.parentElement.id,
                    type: item.parentElement.parentElement.children[1].innerText,
                    category: item.parentElement.parentElement.children[2].innerText,
                    amount: item.parentElement.parentElement.children[3].innerText,
                    date: item.parentElement.parentElement.children[4].innerText,
                    comment: item.parentElement.parentElement.children[5].innerText,
                }
                localStorage.setItem('category', JSON.stringify(category));
                if(item.parentElement.parentElement.children[1].innerText === 'Доход') {
                    location.href = '#/sidebar/income_expenses/change/income';
                } else {
                    location.href = '#/sidebar/income_expenses/change/expense';
                }

            })
        })
    }

}