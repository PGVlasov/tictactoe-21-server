const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();

const server = http.createServer(app);

const PORT = process.env.port || 5000;
const webSocketServer = new WebSocket.Server({ server });

// const rooms = new Set();

// create rooms
// player connects and joines a room

// save who should do the next move in each room

// const rooms = {
//     roomId1: {
//         player1: 'id-1',
//         player1Step: 'X',
//         player2: 'id-2',
//         player2Step: 'O',
//         nextMove: 'player1'
//     }
// }

webSocketServer.on("connection", (ws, req) => {
  console.log("подключение установлено!");

  ws.on("message", (msg) => {
    const message = JSON.parse(msg);
    console.log("MSG___", message);
    switch (message.type) {
      case "CONNECTED":
        connectionHandler(ws, message.payload);
        break;
      case "PLAYER_MOVE":
        broadcastToRoom(ws.clientId, ws.roomId, message);
        break;
    }
  });

  //   ws.on("error", (e) => ws.send(e));

  ws.send("Hi there, I am a WebSocket server");
});

connectionHandler = (ws, msg) => {
  ws.clientId = msg.clientId;
  ws.roomId = msg.roomId;
  console.log("WS__CLIENT__ID", ws.clientId);
  console.log("WS__ROOM__ID", ws.roomId);
  //   broadcastToRoom(ws, msg);
};

// sendToRoom(roomId) {

// }

broadcastToRoom = (clientId, roomId, msg) => {
  console.log(`sending to room ${roomId}, message: ${msg}`);
  webSocketServer.clients.forEach((client) => {
    console.log(`client_id: ${client.id}, roomId: ${roomId}`);
    if (client.roomId === roomId && client.clientId !== clientId) {
      console.log("____sending ---", msg);
      client.send(JSON.stringify(msg));
    }
  });
};

server.listen(PORT, () => console.log(`server is runing on PORT ${PORT}`));
