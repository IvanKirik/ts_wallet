import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import { Chart, registerables } from 'chart.js';
import {OperationsType} from "../type/operations.type";
import {DefaultResponseType} from "../type/default-response.type";
import {CategoriesResponseType} from "../type/categories-response.type";
import {CategoryIncomeExpenseType} from "../type/category-income-expense.type";


export class Home {
    readonly title: HTMLElement | null;
    readonly buttonToday: HTMLElement | null;
    readonly buttonWeek: HTMLElement | null;
    readonly buttonMonth: HTMLElement | null;
    readonly buttonYear: HTMLElement | null;
    readonly buttonAll: HTMLElement | null;
    readonly buttonInterval: HTMLElement | null;
    readonly date: any;
    private dataCategories: OperationsType[] | DefaultResponseType | undefined;
    private incomeCategory: any;
    private expenseCategory: any;

    constructor(title: string) {
        Chart.register(...registerables);
        this.title = document.getElementById('title-home');
        if(this.title)
        this.title.innerText = title;
        const that: Home = this;
        this.init('?period=all')

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
                if (!item.value) {
                    item.classList.add('placeholder-red')
                }
            })
        })

        this.date[1].addEventListener('change', function () {
            if (that.date[0].value && that.date[1].value) {
                that.init(`?period=interval&dateFrom=${that.date[0].value}&dateTo=${that.date[1].value}`);
            }
        })
        this.date[0].addEventListener('change', function () {
            if (that.date[0].value && that.date[1].value) {
                that.init(`?period=interval&dateFrom=${that.date[0].value}&dateTo=${that.date[1].value}`);
            }
        })

        Home.activeButton();
    }

    static activeButton(): void {
        let buttons: any = document.querySelectorAll('.b-int');
        buttons.forEach(onClick);
        function onClick(item: any) {
            item.addEventListener('click', function () {
                let currentBtn = item;

                if(!currentBtn.classList.contains('active-button-interval')) {
                    buttons.forEach((item: HTMLElement) => {
                        item.classList.remove('active-button-interval');
                        item.classList.remove('text-white')
                    })
                    currentBtn.classList.add('active-button-interval')
                    currentBtn.classList.add('text-white');
                }
            })
        }

    }

    private async init(period: string): Promise<void> {
        try {
            const result: OperationsType[] | DefaultResponseType = await CustomHttp.request(config.host + '/operations' + period);
            if (result) {
                this.dataCategories = result;
                Home.cleanCharts();
                await this.getCategoryIncome();
                await this.getCategoryExpense();
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async getCategoryIncome(): Promise<void> {
        try {
            const result: CategoriesResponseType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                this.incomeCategory = result;
                this.dataIncome();
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async getCategoryExpense(): Promise<void> {
        try {
            const result: CategoriesResponseType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/expense');
            if (result) {
                this.expenseCategory = result;
                this.dataExpense();
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }
        } catch (error) {
            console.log(error);
            return
        }
    }

    private dataIncome(): void {
        const arrCategory: CategoryIncomeExpenseType[] = [];
        this.incomeCategory.forEach((item: any)=> {
            arrCategory.push({
                title: item.title,
                operations: [],
                amount: 0,
            })
        })

        arrCategory.forEach((item: any) => {
            (this.dataCategories as unknown as OperationsType).forEach((i: any) => {
                if (item.title === i.category) {
                    item.operations.push(i.amount);
                }
            })
        })

        arrCategory.forEach((item: CategoryIncomeExpenseType) => {
            item.amount = item.operations.reduce((previousValue: number, currentValue: number) => {
                return previousValue + currentValue;
            }, 0);
        })

        let category = arrCategory.map(item => item.title);
        let amount = arrCategory.map(item => item.amount);

        Home.chart(category, amount, 'incomeChart')
    }

    private dataExpense(): void {
        const arrCategory: any[] = [];
        this.expenseCategory.forEach((item: any)=> {
            arrCategory.push({
                title: item.title,
                operations: [],
            })
        })

        arrCategory.forEach((item: any) => {
            (this.dataCategories as unknown as OperationsType).forEach((i: any) => {
                if (item.title === i.category) {
                    item.operations.push(i.amount);
                }
            })
        })

        arrCategory.forEach((item: CategoryIncomeExpenseType) => {
            item.amount = item.operations.reduce((previousValue: number, currentValue: number) => {
                return previousValue + currentValue;
            }, 0);
        })

        let category = arrCategory.map(item => item.title);
        let amount = arrCategory.map(item => item.amount);

        Home.chart(category, amount, 'expenseChart');
    }

    private static chart(labels: any[], dataAmount: any[], id: string): void {
        const data = {
            labels: labels,
            datasets: [{
                label: 'Income',
                backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'],
                data: dataAmount,
                borderWidth: 1,
            }]
        };

        const config: any = {
            type: 'pie',
            data: data,
            options: {}
        };

        let idElement: any = document.getElementById(id);
        if(idElement) {
            let myChart: any = new Chart(
                idElement,
                config
            );
        }


    }

    public static cleanCharts(): void {
        let canvasIncome: HTMLElement | null = document.getElementById('canvas-income');
        let canvasExpense: HTMLElement | null = document.getElementById('canvas-expense');
        let canvasIncomeElement: HTMLElement | null = document.getElementById('incomeChart');
        let canvasExpenseElement: HTMLElement | null = document.getElementById('expenseChart');
        if(canvasIncomeElement) {
            canvasIncomeElement.remove();
            if(canvasIncome)
            canvasIncome.innerHTML = '<canvas id="incomeChart"></canvas>';
        }
        if(canvasExpenseElement) {
            canvasExpenseElement.remove();
            if(canvasExpense)
            canvasExpense.innerHTML = '<canvas id="expenseChart"></canvas>';
        }
    }


}