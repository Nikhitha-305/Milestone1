const cron = require('node-cron');

// A cron job that logs a message every minute
cron.schedule('* * * * *', () => {
    console.log(`Cron job executed at ${new Date().toLocaleString()}`);
});

console.log('Cron job is running...');
