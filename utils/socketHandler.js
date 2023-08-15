import { 
  updateRecordBySocketId,
  findRecordBySocketId } from "../controllers/socketConnectionsController.js";

/**
 * 
 * @param {Object} io - экземпляр io
 * @returns {void} - инициализирует сокеты, подписываясь на события initializeConnection (получает previousId - id предыдущего коннекта) и disconnect (говорит монге о том, что клиент дисконнектнулся)
 */
export const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    socket.on('initializeConnection', async (data) => {
      const { previousId } = data;
      try{
        const existsConnection = await findRecordBySocketId(previousId);
  
        if(existsConnection && !existsConnection.success && existsConnection.wasSended){
          io.to(socket.id).emit("msgToClient", {
            status: "success"
          });
          const updatedRecordSuccess = await updateRecordBySocketId(previousId, 'success');
          console.log(updatedRecordSuccess, 'socket was updated field success');
        }
      }catch(error){
        console.log(error);
      }
    })
    socket.on('disconnect', async () => {
      const updatedDisconnected = await updateRecordBySocketId(socket.id, 'wasDisconnected')
    });
  });
};
