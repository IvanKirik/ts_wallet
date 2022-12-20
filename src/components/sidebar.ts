import {Auth} from "../services/auth";
import {Operations} from "../services/operations";
import {UserInfo, UserInfoType} from "../type/user-info.type";

export class Sidebar {
    readonly sidebar: HTMLElement | null;
    readonly home: HTMLElement | null;
    readonly incomeExpenses: HTMLElement | null;
    readonly income: HTMLElement | null;
    readonly expenses: HTMLElement | null;
    readonly user: HTMLElement | null;
    public balance: HTMLElement | null | undefined;
    readonly logout: HTMLElement | null;
    readonly userInfo: UserInfoType | null;
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        if(this.sidebar)
        this.sidebar.classList.remove('d-none');
        this.home = document.getElementById('home');
        if(this.home) {
            this.home.addEventListener('click', function () {
                location.href = '#/sidebar/home';
            })
            if(location.href === '#/sidebar/home') {
                this.home.click();
            }
        }

        this.incomeExpenses = document.getElementById('income-expenses');
        this.income = document.getElementById('income');
        this.expenses = document.getElementById('expenses');
        this.user = document.getElementById('user');

        if(this.income)
        this.income.onclick = function () {
            localStorage.setItem('route', 'income')
            location.href = '#/sidebar/income';
        }
        if(this.expenses)
        this.expenses.onclick = function () {
            localStorage.setItem('route', 'expense')
            location.href = '#/sidebar/expense';
        }
        if(this.incomeExpenses)
        this.incomeExpenses.onclick = function () {
            location.href = '#/sidebar/income_expenses'
        }

        this.userInfo = Auth.getUserInfo();
        if(this.user){
            this.user.innerText = (this.userInfo as unknown as UserInfo).name + ' ' + (this.userInfo as unknown as UserInfo).lastName;
        }

        this.balance = document.getElementById('balance');
        this.logout = document.getElementById('logout');
        if(this.logout)
        this.logout.addEventListener('click', function () {
            Auth.logAut();
            location.href = '#/';
        })

        Operations.updateBalance();
        this.activeButton();
    }

    private activeButton(): void {
        let buttons: any = document.querySelectorAll('.menu-item');
        buttons.forEach(onClick);
        function onClick(item: {
            classList: any;
            addEventListener: (arg0: string, arg1: () => void) => void; }): void {
            item.addEventListener('click', function () {
                let currentBtn = item;
                if(!(currentBtn as HTMLElement).classList.contains('active-button-menu')) {
                    buttons.forEach((item: any) => {
                        (item as HTMLElement).classList.remove('active-button-menu');
                        (item as HTMLElement).classList.remove('text-white');
                    })
                    currentBtn.classList.add('active-button-menu');
                    currentBtn.classList.add('text-white');
                }
            })
        }

    }

}