import { demonLog } from "../models/demonStarts.js";

/**
 * Сохраняет лог в базу данных MongoDB.
 *
 * @param {string} message - Сообщение для записи в лог.
 * @param {string} url - URL запроса, который будет записан в лог.
 * @param {Object} options - Объект с опциями запроса, который будет записан в лог.
 * @returns {Promise<void>} Возвращает Promise, который разрешается без значений после успешного сохранения лога.
 *
 * @example
 * try {
 *   await writeDemonLog('GET request', 'https://api.example.com', { headers: { 'Content-Type': 'application/json' } });
 * } catch (error) {
 *   console.error('Failed to save log:', error);
 * }
 */
export const writeDemonLog = async (message, url, options) => {
  const log = new demonLog({ message, url, options});
  
  try {
    await log.save();
    console.log('Log saved successfully');
  } catch (error) {
    console.error('Error saving log:', error);
  }
};