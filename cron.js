const cron = require('node-cron');
const WebSocket = require('ws');

const sendReminder = () => {
  const ws = new WebSocket.Server({ port: 8080 });

  ws.on('connection', (socket) => {
    socket.send("Reminder: Don't forget to complete your habits today!");
  });
};

cron.schedule('0 9 * * *', sendReminder); // Runs at 9 AM daily
