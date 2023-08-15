import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Readable } from "stream";
import {
  createFileName,
  customFetch,
  io,
  isValideToken,
  isValideFieldsRequest,
  responseParse,
  isFile
} from "../utils/index.js";

import { 
  updateRecordBySocketId,
  writeSocketProcessLog,
  findRecordBySocketId
} from "../controllers/socketConnectionsController.js";
import { writeDemonLog } from "../controllers/demonStartsController.js";
import { getTokenByTokenValue } from "../controllers/tokenController.js";

import '../swaggerDocs/demonStartSwagger.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Обрабатывает POST запрос на '/demon-start'.
 * Эмитирует событие через socket.io при получении запроса.
 * Осуществляет два последовательных fetch запроса:
 * 1. К указанному API URL.
 * 2. К callback URL с ответом от первого запроса.
 *
 * @async
 * @function
 * @param {Object} req - Объект запроса Express.
 * @param {Object} socketId - id коннекта сокета со фронта
 * @param {Object} req.body - Тело запроса.
 * @param {string} req.body.apiUrl - URL API, к которому будет осуществлен первый запрос.
 * @param {string} req.body.callbackUrl - URL для callback запроса.
 * @param {Object} req.body.options - Опции для первого запроса.
 * @param {string} req.body.methodApi - HTTP метод для первого запроса (например, 'GET', 'POST').
 * @param {string} req.body.methodCallbackApi - HTTP метод для callback запроса.
 * @param {string} req.body.callbackNotificationUrl  - url api, куда отправить уведомление
 * @param {Object} req.body.optionsNotification - параметры для запроса к callbackNotificationUrl.
 * @param {string} req.body.callbackNotificationMethod  - url api, куда отправить уведомление
 * @returns {Promise<Object>} - Отправляет ответ с данными от callback запроса.
 *
 * @example
 * POST /demon-start
 * {
 *   "apiUrl": "http://example.com/api",
 *   "callbackUrl": "http://example.com/callback",
 *   "options": {},
 *   "methodApi": "GET",
 *   "methodCallbackApi": "POST"
 * {
    socketId: socketConnection.socketId,
    apiUrl:
      "http://printer.remcraft.testers-site.ru/generate?url=https://remcraft-test.testers-site.ru/client/0068-centralnyi-zk-54-anna&marginLeft=0&marginRight=0",
    methodApi: "GET",
    options: {},
    methodCallbackApi: "POST",
    callbackUrl: "http://188.68.216.188:4005/test-post",
    authToken: "token",
    callbackNotificationUrl: "http://188.68.216.188:4005/test-post",
    optionsNotification: {
      SMTH: "SMTH",
    },
    callbackNotificationMethod: "POST",
  }
 * }
 */

router.post("/demon-start", upload.single("file"), async (req, res) => {
 
  if (!isValideFieldsRequest(Object.values(req.body))) {
    await writeDemonLog(`Invalid fields request`, req.body.apiUrl, req.body);

    res.status(400).json({ status: "Bad request", message: "Invalid fields" });
    return;
  }

  const {
    socketId,
    apiUrl,
    options,
    callbackUrl,
    methodApi,
    methodCallbackApi,
    authToken,
    callbackNotificationUrl,
    optionsNotification,
    callbackNotificationMethod,
  } = req.body;

  const fieldsForValidations = [
    socketId, 
    apiUrl, 
    options, 
    callbackUrl, 
    methodApi,
    methodCallbackApi, 
    authToken, 
    callbackNotificationUrl, 
    optionsNotification, 
    callbackNotificationMethod
  ]
  
  if (!isValideFieldsRequest(fieldsForValidations)) {
    await writeDemonLog(`Invalid fields request`, req.body.apiUrl, req.body);

    res.status(400).json({ status: "Bad request", message: "Invalid fields" });
    return;
  }

  try {
    console.log(socketId, 'socket from body');

    const responseTokenByValue = await getTokenByTokenValue(req, res);

    const tokenName = responseTokenByValue.dataValues?.tokenName;
    // проверка токена
    if (!isValideToken(tokenName)) {
      await writeDemonLog(`Invalid token: ${authToken}`, apiUrl, req.body);

      res.status(401).json({ status: "Unauthorized" });
      return;
    }
  } catch (error) {
    if (error.message === "Token is required in request body") {
      res.status(400).json({ status: "Bad request", message: error.message });
      return;
    } else if (error.message === "Token not found") {
      res.status(401).json({ status: "Unauthorized", message: error.message });
      return;
    } else {
      res
        .status(500)
        .json({
          status: "Internal server error",
          message: "Unexpected error occurred",
        });
      return;
    }
  }

  await writeDemonLog(`Get request ${req}`);

  await writeSocketProcessLog(socketId);

  const updatedSendedField = await updateRecordBySocketId(socketId, 'wasSended');

  try {
    const responseFirstFetch = await customFetch(apiUrl, methodApi, options);

    const contentType = responseFirstFetch.headers.get("Content-Type");
    // отправка файла (если это файл)
    if (isFile(contentType)) {
      const fileName = createFileName(responseFirstFetch);

      if(!fileName) {
        writeDemonLog(`Create fileName error with request: ${req}`);
        res.status(400).send({ status: 'error', message: "bad headers" });
      }

      const fileWriteStream = fs.createWriteStream(
        path.join(__dirname, `../${process.env.FILES_PATH}`, fileName)
      );

      responseFirstFetch.body.pipe(fileWriteStream);

      fileWriteStream.on("finish", async () => {
        const fileReadStream = fs.createReadStream(
          path.join(__dirname, `../${process.env.FILES_PATH}`, fileName)
        );

        const responseCallback = await customFetch(
          callbackUrl,
          methodCallbackApi,
          {
            data: fileReadStream,
          }
        );

        const stream = new Readable.from(JSON.stringify(responseCallback));
        stream.pipe(res);

        fileWriteStream.on("error", (err) => {
          console.error("Ошибка при сохранении файла:", err);
          res.status(500).send({
            status: "Error",
            message: "Ошибка при сохранении файла",
          });
        });

        const callbackNotificationResponse = await customFetch(
          callbackNotificationUrl,
          callbackNotificationMethod,
          optionsNotification
        );

        const isExistsProcess = await findRecordBySocketId(socketId);

      // если соединение потеряно - не отправляем ничего на клиента
        if(isExistsProcess.wasDisconnected) return;

        io.to(socketId).emit("msgToClient", {
          message: "Операция выполнена",
          data: responseCallback,
        });

        const updatedRecordSuccess = await updateRecordBySocketId(socketId, 'success');

      });
    } else {
      // Отправка обычных данных
      const dataFirstFetch = await responseParse(responseFirstFetch);

      const responseCallback = await customFetch(
        callbackUrl,
        methodCallbackApi,
        {
          response: dataFirstFetch,
        }
      );

      const responseJson = await responseCallback.json();

      const callbackNotificationResponse = await customFetch(
        callbackNotificationUrl,
        callbackNotificationMethod,
        optionsNotification
      );

      const isExistsProcess = await findRecordBySocketId(socketId);
      // если соединение потеряно - не отправляем ничего на клиента
      if(isExistsProcess.wasDisconnected) return;

      io.to(socketId).emit("msgToClient", {
        message: "Операция выполнена",
        data: responseJson,
      });

      const updatedRecordSuccess = await updateRecordBySocketId(socketId, 'success');

      res.status(200).send({ status: "success", data: responseJson });
    }
  } catch (error) {
    res.status(400).send({ status: "Error", message: error.message });
  }
});

export default router;
