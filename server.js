const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Рассылка сообщения всем подключенным клиентам
    wss.clients.forEach(function each(client) {
      console.log(client)
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // Убедитесь, что отправляемые данные являются строкой JSON
        const messageToSend = JSON.stringify(message);
        client.send(messageToSend);
      }
    });
    
  });
});

function sendData(data , conn) {
  conn.send(JSON.stringify(data))
}

console.log('WebSocket server started on ws://localhost:3000');
