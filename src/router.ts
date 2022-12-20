import {Form} from "./components/form";
import {Sidebar} from "./components/sidebar";
import {Income} from "./components/income";
import {Expenses} from "./components/expenses";
import {AddedCategory} from "./components/addedCategory";
import {RedactionCategory} from "./components/redactionCategory";
import {IncomeExpense} from "./components/incomeExpense";
import {CreateIncomeExpense} from "./components/createIncomeExpense";
import {ChangeIncomeExpense} from "./components/changeIncomeExpense";
import {Home} from "./components/home";
import {RouteType} from "./type/route.type";


export class Router {
    readonly contentElement: HTMLElement | null;
    readonly styles: HTMLElement | null;
    readonly title: HTMLElement | null;
    private routes: RouteType[];
    constructor() {
        this.contentElement = document.getElementById('content');
        this.styles = document.getElementById('styles');
        this.title = document.getElementById('title');

        this.routes = [
            {
                route: '#/',
                tittle: 'Вход',
                template: 'templates/signIn.html',
                styles: 'css/index.css',
                load: () => {
                    new Form('signIn');
                }
            },
            {
                route: '#/registration',
                tittle: 'Создайте аккаунт',
                template: 'templates/registration.html',
                styles: 'css/index.css',
                load: () => {
                    new Form('signUp');
                }
            },
            {
                route: '#/sidebar/income',
                tittle: 'Доходы',
                template: 'templates/income.html',
                styles: 'css/category.css',
                load: () => {
                    new Income('Доходы', '#/sidebar/create_category_income');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/expense',
                tittle: 'Расходы',
                template: 'templates/income.html',
                styles: 'css/category.css',
                load: () => {
                    new Expenses('Расходы', '#/sidebar/create_category_expenses');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/create_category_income',
                tittle: 'Создание категории доходов',
                template: 'templates/addCategory.html',
                styles: 'css/index.css',
                load: () => {
                    new AddedCategory('Создание категории доходов');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/create_category_expenses',
                tittle: 'Создание категории расходов',
                template: 'templates/addCategory.html',
                styles: 'css/index.css',
                load: () => {
                    new AddedCategory('Создание категории расходов');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/redaction_category_income',
                tittle: 'Редактирование категории доходов',
                template: 'templates/redactionCategory.html',
                styles: 'css/index.css',
                load: () => {
                    new RedactionCategory('Редактирование категории доходов', '#/sidebar/income');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/redaction_category_expense',
                tittle: 'Редактирование категории расходов',
                template: 'templates/redactionCategory.html',
                styles: 'css/index.css',
                load: () => {
                    new RedactionCategory('Редактирование категории расходов', '#/sidebar/expense');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/income_expenses',
                tittle: 'Доходы и расходы',
                template: 'templates/incomeExpense.html',
                styles: 'css/expense_income.css',
                load: () => {
                    new IncomeExpense('Доходы и расходы');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/create/income',
                tittle: 'Создание дохода/расхода',
                template: 'templates/createIncomeExpense.html',
                styles: 'css/expense_income.css',
                load: () => {
                    new CreateIncomeExpense('Создание дохода/расхода', '1');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/create/expense',
                tittle: 'Создание дохода/расхода',
                template: 'templates/createIncomeExpense.html',
                styles: 'css/expense_income.css',
                load: () => {
                    new CreateIncomeExpense('Создание дохода/расхода', '2');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/income_expenses/change/income',
                tittle: 'Редактирование дохода/расхода',
                template: 'templates/createIncomeExpense.html',
                styles: 'css/expense_income.css',
                load: () => {
                    new ChangeIncomeExpense('Редактирование дохода/расхода', '1');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/income_expenses/change/expense',
                tittle: 'Редактирование дохода/расхода',
                template: 'templates/createIncomeExpense.html',
                styles: 'css/expense_income.css',
                load: () => {
                    new ChangeIncomeExpense('Редактирование дохода/расхода', '2');
                    new Sidebar();
                }
            },
            {
                route: '#/sidebar/home',
                tittle: 'Главная',
                template: 'templates/home.html',
                styles: 'css/expense_income.css',
                load: () => {
                    new Home('Главная');
                    new Sidebar();
                }
            },
        ]
    }

    // public async openRoute(): Promise<void> {
    //     const urlRoute: string = window.location.hash.split('?')[0];
    //     const newRoute: RouteType | undefined = this.routes.find(item => {
    //         return item.route === urlRoute;
    //     });
    //
    //     if (!newRoute) {
    //         window.location.href = '#/';
    //         return;
    //     }
    //
    //     if(this.contentElement)
    //     this.contentElement.innerHTML = await fetch(newRoute.template)
    //         .then(response => response.text());
    //     if(this.styles)
    //     this.styles.setAttribute('href', newRoute.styles);
    //     if(this.title)
    //     this.title.innerText = newRoute.tittle;
    //
    //     newRoute.load();
    // }
    public async openRoute(): Promise<void> {
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash.split('?')[0];
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        if(this.contentElement)
        this.contentElement.innerHTML = await fetch(newRoute.template)
            .then(response => response.text());
        if(this.styles)
        this.styles.setAttribute('href', newRoute.styles);
        if(this.title)
        this.title.innerText = newRoute.tittle;

        newRoute.load();
    }


}