# Demon-worker

## Принцип работы:

Принимает параметры, описанные [здесь](http://188.68.216.188:4005/api-docs/).
Посылает запрос на apiUrl, ждёт результат и отправляет запрос с этим результатом на callbackUrl с соответствующими параметрами.
После отсылает запрос на callbackNotificationUrl с соответствующими параметрами.

Далее делает emit по сокетам с событием msgToClient.
Если коннект с сокетами был разорван, то, при следующем подключении делает emit на новый id сокетов с сообщением об успехе.

## Схема работы

[Схема работы апи miro](https://miro.com/app/board/uXjVMvGVg-g=/)