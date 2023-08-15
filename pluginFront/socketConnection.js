import { io } from "socket.io-client";

export class SocketConnection {
  constructor(url) {
    this.url = url;
    this.socket;
    this.socketId;
    this.previousId;
  }

  newConnection(callback) {
    if (!localStorage.getItem("socketId")) {
      this.socket = io(this.url);

      this.socket.on("connect", () => {
        console.log(
          this.socket,
          this.socket.id,
          this.socket.connected,
          "long string nahooy"
        );

        localStorage.setItem("socketId", this.socket.id);
        this.socketId = this.socket.id;
        console.log(this.socketId);
      });
    } else {
      this.socket = io(this.url);
      
      this.socket.on("connect", () => {
        console.log("success connected");
        this.previousId = localStorage.getItem("socketId");
        this.socket.emit('initializeConnection', {previousId: this.previousId});
        this.socketId = this.socket.id;
        localStorage.setItem("socketId", this.socketId);
      });
    }

    this.socket.on("msgToClient", (data) => {
      console.log("incoming data");
      callback();
    });
  }

  closeConnection() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}