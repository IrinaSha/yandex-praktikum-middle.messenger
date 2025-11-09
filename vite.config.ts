import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    root: resolve(__dirname, 'src'),
    server: {
        port: 3000
    },
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                error500: resolve(__dirname, 'src/pages/error-500.html'),
                error400: resolve(__dirname, 'src/pages/error-400.html'),
                login: resolve(__dirname, 'src/pages/login.html'),
                registration: resolve(__dirname, 'src/pages/registration.html'),
                chats: resolve(__dirname, 'src/pages/chats.html'),
                userProfile: resolve(__dirname, 'src/pages/user-profile.html')
            }
        }
    },
    plugins: [
        handlebars({
            partialDirectory: resolve(__dirname, 'src/components'),
            context: {
                login: 'shabliy',
                fname: 'Ирина',
                sname: 'Шаблий',
                dname: 'Ирина89',
                email: 'rozova.ia@yandex.ru',
                phone: '+7 (904) 330-66-28',
                errorCode400: '404',
                errorText400: 'Не туда попали',
                errorCode500: '500',
                errorText500: 'Мы уже фиксим',
                loginTitle: 'Вход',
                btnLoginText: 'Авторизоваться',
                navToRegistrationText: 'Нет аккаунта?',
                navToChatsText: 'Войти',
                loginErrorText: 'Неверный логин',
                noValid: true,
                registrationTitle: 'Регистрация',
                btnRegText: 'Заригистрироваться',
                lblLoginText: 'Логин',
                lblPwdText: 'Пароль',
                lblConfirmPwdText: 'Пароль (еще раз)',
                lblEmailText: 'Почта',
                lblFNameText: 'Имя',
                lblSNameText: 'Фамилия',
                lblDisplayNameText: 'Имя в чате',
                lblPhoneText: 'Телефон',
                lblMessageText: 'Сообщение',
                exitText: 'Выйти',
                profileEditUserInfo: true,
                changePassword: true,
                lblOldPasswordText: 'Старый пароль',
                lblNewPasswordText: 'Новый пароль',
                btnChangeInfoText: 'Изменить данные',
                btnChangePwdText: 'Изменить пароль',
            },
        })
    ]
});
