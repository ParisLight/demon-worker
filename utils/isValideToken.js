/**
 * Проверяет валидный токен
 * @function
 * @param { String } token - токен
 * @returns { Boolean } - true - валидный, иначе false
 */

export const isValideToken = (token) => {
  return token != undefined || token != null || token;
}