import { connectionLog } from "../models/socketsConnections.js";

/**
 * @param {string} socketId - текущий id коннекта сокетов
 * @param {string} message - сообщение о логировании
 */

export const writeConnectionMapLog = async (socketId, message) => {
  if (!socketId || socketId === undefined) {
    const log = new connectionLog({
      socketId: "empty",
      message: "socketId is not valide",
    });

    try {
      await log.save();
      console.log("Log saved successfully");
    } catch (error) {
      console.error("Error saving log:", error);
    }
  }

  const log = new connectionLog({
    socketId: socketId,
    message: message,
  });

  try {
    await log.save();
    console.log("Log saved successfully");
  } catch (error) {
    console.error("Error saving log:", error);
  }
};

/**
 * 
 * @param {string} socketId - id коннекта, который нужно найти 
 * @returns {Promise<Object>} - возвращает найденную запись
 */
export const findRecordBySocketId = async (socketId) => {
  try {
    const record = await connectionLog.findOne({ socketId: socketId });
    return record;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};
/**
 * 
 * @param {string} socketId - id коннекта, который будет записан
 * @returns {void}
 */
export const writeSocketProcessLog = async (socketId) => {
  console.log(socketId, 'writeSocketProcessLog');
  try {
    let logValue = socketId;

    if (!socketId) {
      console.log(socketId, 'socketId from function');
      logValue = "empty";
    }

    const log = new connectionLog({
      socketId: logValue
    });
    
    await log.save();
    console.log("Log saved successfully");

  } catch (error) {
    console.error("Error saving log:", error);
  }
}
/**
 * 
 * @param {string} socketId - id коннекта записи, которую нужно обновить
 * @param {string} field - поле, которое нужно обновить на true
 * @returns {Promise<Object>} - возвращает обновленную запись
 */
export const updateRecordBySocketId = async (socketId, field) => {
  console.log(socketId, 'socket inside updateRecord function');

  try{
    const updatedRecord = await connectionLog.findOneAndUpdate(
      { socketId: socketId },
      { [field]: true },
      { new: true }
    )
    console.log(updatedRecord, 'updatedRecord');
    return updatedRecord;
  }catch(error){
    throw error;
  }
}