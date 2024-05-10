const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message)
    // const data = JSON.parse(message)
    // if(data.type === 'offer'){
    //   sendData({
    //     type: "offer",
    //     offer: user.offer
    // }, connection)
    //console.log(data)

    wss.clients.forEach(function each(client) {
      //if(data.type === 'offer') {
        //client.send(JSON.stringify(data));
      //}
    });
  });
});


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Рассылка сообщения всем подключенным клиентам
    wss.clients.forEach(function each(client) {
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
