// import { SocketConnection } from './socketConnection.js'
import { SocketConnection } from "./dist/websockets-connection.bundle.js";

const testNaval = (param) => {
  console.log(`testNaval ${param}`);
}

const socketConnection = new SocketConnection('http://188.68.216.188:4006');

socketConnection.newConnection(testNaval('param'));