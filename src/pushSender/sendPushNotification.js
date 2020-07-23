const gcm = require('node-gcm')
const chalk = require('chalk');

function sendPushNotification(options) {
    let apiKey = options.project.apiKey;
    let devices = options.devices;
    let receivers = devices.map(d => {
        return d.token
    });
    console.log(chalk.red('receivers: ' + receivers));
    let message = new gcm.Message(options.message);

    console.debug('APIKEY: ' + apiKey);
    const sender = new gcm.Sender(apiKey);

    // Actually send the message
    sender.send(message, {registrationTokens: receivers}, function (err, response) {
        if (err) {
            console.error(err + " ::: " + response);
        } else {
            console.log(response);
        }
    });
}

function fakeSender(options) {
    console.log('*********');
    console.log('Send:');
    console.log('ApiKey: ', options.project.apiKey);
    console.log('Receiver:', options.devices.map(d => d.token));
    console.log('Message: ', options.message);
    console.log('*********');
}

module.exports = {
    sendPushNotification: fakeSender
};
