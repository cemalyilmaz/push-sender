const project = require('./projectCommand');
const device = require('./deviceCommand');
const template = require('./templatesCommand');
const message = require('./messageCommand');
const sendPush = require('./sendPushNotificationCommand');

function initCommands(pushSender) {
    let commands = []
    // .concat(Object.values(message))
    // .concat(Object.values(project))
    // .concat(Object.values(device))
    // .concat(Object.values(template))
    // .concat(Object.values(sendPush))

    commands.map(command => {
        command(pushSender.vorpal)
    });
    sendPush.sendPushNotification(pushSender);
    sendPush.clearCommand(pushSender);

    project.addProjectCommand(pushSender);
    project.editProjectCommand(pushSender);
    project.listProjectsCommand(pushSender);
    project.removeProjectCommand(pushSender);
    project.selectProjectCommand(pushSender);

    device.addDeviceCommand(pushSender);
    device.editDeviceCommand(pushSender);
    device.listDevicesCommand(pushSender);
    device.removeDeviceCommand(pushSender);
    device.selectDeviceCommand(pushSender);

    template.templatesCommand(pushSender);

    message.buildMessageCommand(pushSender);
    message.showMessageCommand(pushSender);
}

module.exports = initCommands