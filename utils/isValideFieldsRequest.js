/**
 * 
 * Проверяет поля объекта (null, undefined, '')
 * 
 * @function
 * @param {Array} fields 
 * @returns {Boolean} - возвращает false, если хотя бы одно поле невалидное, иначе true
 * @example
 * 
 * isValideFieldsRequest([apiUrl, options, callbackUrl, methodApi])
 */
export const isValideFieldsRequest = (fields) => fields.every(field => typeof field != "undefined" && field != null && field != '');