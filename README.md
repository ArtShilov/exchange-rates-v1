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
Node (min 13v)
Создать файл .env в папке server/ 
requestCBRonDate - ссылка для получения котировок на заданный день 
Пример файла: 
requestCBRonDate = 'http://www.cbr.ru/scripts/XML_daily.asp'

## Инструкция по развертыванию на Heroku
* Установить heroku (https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
Пройти регистрацию на сайте
Пройти аутентификацию 
```sh
heroku login 
```
Create New App -> Выбрать название 

* В папке проекта прописать команды:
1. Инициализировать Git репозиторий
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


