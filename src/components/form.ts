import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import {FormFieldType} from "../type/form-field.type";
import {SignupResponseType} from "../type/signup-response.type";
import {LoginResponseType} from "../type/login-response.type";

export class Form {
    readonly sidebar: HTMLElement | null;
    readonly processElement: HTMLElement | null;
    readonly page: 'signIn' | 'signUp';
    readonly content: HTMLElement | null;
    private fields: FormFieldType[] = [];

    constructor(page: 'signIn' | 'signUp') {
        this.sidebar = document.getElementById('sidebar');
        this.processElement = null;
        this.page = page;
        this.content = document.getElementById('content');
        if(this.content)
        this.content.style.width = '100%';
        if(this.sidebar)
        this.sidebar.classList.add('d-none')

        const accessToken: string | null  = localStorage.getItem(Auth.accessTokenKey);
        if(accessToken) {
            location.href = '#/sidebar/home';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^[^ ]+@[^ ]+\.[a-z]{2,3}$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                valid: false,
            },
        ];

        if (this.page === 'signUp') {
            this.fields.unshift(
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /[A-Za-zА-Яа-яЁё]+(\s+[A-Za-zА-Яа-яЁё]+)?/,
                    valid: false,
                });
        }

        const that = this;
        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if(item.element)
            item.element.onchange = function () {
                that.validateField.call(that, item, <HTMLInputElement>this);
            }

        });

        this.processElement = document.getElementById('process');
        if(this.processElement)
        this.processElement.onclick = function () {
            that.processForm();
        }

    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
            field.valid = true;
        }
        this.repeatPasswordVal();
        this.validateForm();
    }

    private validateForm(): boolean {
        const validForm = this.fields.every(item => item.valid);
        if(this.processElement)
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }

        return validForm;
    }

    private repeatPasswordVal(): void {
        if(this.page === 'signUp') {
            let password: HTMLElement | null = document.getElementById('password');
            let repeatPassword: HTMLElement | null = document.getElementById('repeat-password');
            if(password && repeatPassword)
            repeatPassword.onchange = function () {
                if(password && repeatPassword)
                if((password as HTMLInputElement).value !== (repeatPassword as HTMLInputElement).value) {
                    repeatPassword.classList.add('is-invalid');
                } else {
                    repeatPassword.classList.remove('is-invalid');
                    repeatPassword.classList.add('is-valid');
                }
            }

        }
    }

    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email')?.element?.value;
            const password = this.fields.find(item => item.name === 'password')?.element?.value;

            if (this.page === 'signUp') {
                const name = this.fields.find(item => item.name === 'name')?.element?.value.split(' ')[0];
                const lastName = this.fields.find(item => item.name === 'name')?.element?.value.split(' ')[1];
                const repeatPassword = document.getElementById('repeat-password');
                const repeatPasswordValue = (repeatPassword as HTMLInputElement).value;
                try {
                    const result: SignupResponseType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: repeatPasswordValue,
                    })

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                        location.href = '#/';
                    }
                } catch (error) {
                    return console.log(error);
                }
            }
            try {
                let rememberMe: HTMLElement | null = document.getElementById('checkbox-remember');
                let remember: boolean;
                if(rememberMe){
                    if((rememberMe as HTMLInputElement).checked)
                    remember = true;
                }

                const result: LoginResponseType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: remember!,
                })

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken
                        || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id,
                        email: (email as string).toString(),
                    })
                    location.href = '#/sidebar/home';
                }
            } catch (error) {
                console.log(error);
            }

        }
    }
}