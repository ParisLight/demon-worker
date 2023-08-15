/**
 * @swagger
 * /demon-start:
 *   post:
 *     summary: запрос к апи
 *     tags:
 *       - Demon Worker
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Данные запроса демона
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             socketId:
 *               type: string
 *               example: "oA99A0k8I6aoxwqvAAAB"
 *             apiUrl:
 *               type: string
 *               example: "http://printer.remcraft.testers-site.ru/generate?url=https://remcraft-test.testers-site.ru/client/0068-centralnyi-zk-54-anna&marginLeft=0&marginRight=0"
 *             options:
 *               type: object
 *               example:
 *                 templateId: "1blXVTQjfnRLTLb4zV37V2m2lU5P9RFcb9KNpSiLNVLk"
 *             callbackUrl:
 *               type: string
 *               example: "http://188.68.216.188:4005/test-post"
 *             methodApi:
 *               type: string
 *               example: "GET"
 *             methodCallbackApi:
 *               type: string
 *               example: "POST"
 *             authToken:
 *               type: string
 *               example: "token"
 *             callbackNotificationUrl:
 *               type: string
 *               example: "http://188.68.216.188:4005/test-post"
 *             optionsNotification:
 *               type: object
 *               example:
 *                 SMTH: "SMTH"
 *             callbackNotificationMethod:
 *               type: string
 *               example: "POST"
 *     responses:
 *       200:
 *         description: Успешная обработка
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             data:
 *               type: object
 *       400:
 *         description: Неверный запрос
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *       401:
 *         description: Не авторизован
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *       500:
 *         description: Внутренняя ошибка сервера
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 */