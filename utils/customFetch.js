import { writeDemonLog } from "../controllers/demonStartsController.js";
import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";

/**
 * Кастомная функция fetch для выполнения HTTP-запросов.
 *
 * @param {string} apiUrl - URL API, к которому нужно обратиться.
 * @param {string} method - HTTP-метод, который следует использовать (например, 'GET', 'POST' и т.д.).
 * @param {Object} body - Тело запроса. Это должен быть объект, который будет преобразован в строку и отправлен в виде JSON.
 *
 * @returns {Promise<Response>} Возвращает Promise, который разрешается объектом Response. Если запрос не удался, функция залогирует ошибку и вернет undefined.
 *
 * @example
 * const response = await customFetch('https://api.example.com/data', 'POST', { key: 'value' }, { 'Content-Type': 'application/json' });
 */
export const customFetch = async (
  apiUrl,
  method,
  body = null,
  contentType = "application/json"
) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": contentType,
      },
    };
    const httpMethods = ["POST", "PUT", "PATCH"]

    if (body && httpMethods.includes(method)) {
      if (body.data?.path) {
        const filePath = body.data.path;

        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        return await fetch(apiUrl, {
          method: method,
          body: formData,
        });
      } else {
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(apiUrl, options);

    writeDemonLog("response", apiUrl, JSON.stringify(body));

    return response;

  } catch (error) {
    writeDemonLog(`Error response with error ${error.message}`, apiUrl, body);

    console.error(`Fetch to ${apiUrl} failed: ${error.message}`);

    return;
  }
};
