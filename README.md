# Проект «Мессенджер» на курсе Яндекс.Практикум. Middle-frontend разработчик.

[Ссылка на github](https://github.com/IrinaSha/yandex-praktikum-middle.messenger.git)

[Ссылка на макет figma](https://www.figma.com/design/Ej5Gn4JGcJ6ZnafLhGVBNw/messenger_shabliy?node-id=1-498&m=dev&t=ltNywIHgbU0NZVnH-1)

[Ссылка на собранную версию Спринт 1](https://messenger-ishabliy.netlify.app/)

---

## Описание

Представляет собой многостраничное приложение, реализующее функции обмена сообщениями между пользователями
При переходе по [ссылке](https://messenger-ishabliy.netlify.app/) можно ознакомиться со всеми доступными страницами.
Проектом предусмотрены следующие страницы (ссылки на собранную версию):
1) [Страница авторизации](https://messenger-ishabliy.netlify.app/pages/login)
2) [Страница регистрации](https://messenger-ishabliy.netlify.app/pages/registration)
3) [Страница чатов](https://messenger-ishabliy.netlify.app/pages/chats)
4) [Страница профиля пользователя](https://messenger-ishabliy.netlify.app/pages/user-profile)
5) [Страница ошибок 400](https://messenger-ishabliy.netlify.app/pages/error-400)
6) [Страница ошибок 5**](https://messenger-ishabliy.netlify.app/pages/error-500)

### Предварительные требования

Убедитесь, что у вас установлены:

- Node.js v20.19.0 и выше. Скачайте его с [nodejs.org](https://nodejs.org/en).
- Git. Скачайте его с [git-scm.com](https://git-scm.com/).

## Разработка проекта

Для работы с проектом перейдите по [ссылке](https://github.com/IrinaSha/yandex-praktikum-middle.messenger.git)
и скачайте проект.

С помощью команды

`npm install`

установите требуемые зависимости. После успешной установки в папке проекта появится папка **node_modules**

## Используемые технологии

- Проект разрабатывается на языке TypeScript https://www.typescriptlang.org/
- В качестве сборщика используется Vite https://www.typescriptlang.org/
- Страницы разработаны с помощью шаблонизатора Handlebars https://handlebarsjs.com/
- Для описания стилей используется препроцессор https://sass-scss.ru/guide/
- Для разворачивания приложения в сети интернет используется сервис https://www.netlify.com/

## Запуск проекта

Команда для запуска проекта
"start": "npm run build && node ./server.js" (прописан в файле package.json можно запускать там)
можно запускать через терминал 
`npm start`
