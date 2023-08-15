import { isFile } from "./isFile.js";

/**
 * 
 * @param {Object} response 
 * @returns {Promise<Object>} - возвращает обработанный response
 */

export const responseParse = async (response) => {

  const contentType = response.headers.get('Content-Type');

  let responseData;

  if (isFile(contentType)) {
    responseData = await response.blob();
  } 
  else if (contentType.includes("application/json")) {
    responseData = await response.json();
  } 
  else {
    responseData = await response.text();
  }
  return responseData;
};
