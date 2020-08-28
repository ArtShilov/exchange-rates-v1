## Описание
* Автоматическая и ручная загрузка курсов валют с (http://cbr.ru/development/SXML/)
* Таблица с возможностью фильтрации и сортировки
* График для просмотра изменения курса

## Запуск в режиме разработки

```sh
$ npm run installDep  
$ npm run dev
```

## Требования к среде исполнения
Node (min 13v) <br />
Создать файл .env в папке server/ <br />
requestCBRonDate - ссылка для получения котировок на заданный день <br />
Пример файла: <br />
requestCBRonDate = 'http://www.cbr.ru/scripts/XML_daily.asp'

## Инструкция по развертыванию на Heroku
* Установить heroku (https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
Пройти регистрацию на сайте<br />
Пройти аутентификацию <br />
```sh
heroku login 
```
Create New App -> Выбрать название <br />

* В папке проекта прописать команды:<br />
1. Инициализировать Git репозиторий<br />
```sh
git init
heroku git:remote -a PROJECT__NAME
```
2. Развернуть на Heroku
```sh
$ git add .
$ git commit -am "first commit"
$ git push heroku master
```
* Указать переменную из файла .env:
Settings -> Config Vars  ->  прописать переменную requestCBRonDate


## Используемый стек технологий

* React 
* Express
* sqlite3
* highcharts
* react-select


