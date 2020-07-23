const db = require('../database/Database').singleton();

const ProjectRepository = require('../project/ProjectRepository');
const projectRepository = new ProjectRepository({db});

const DeviceRepository = require('../device/DeviceRepository');
const deviceRepository = new DeviceRepository({db});

const Templates = require('../templates/templates');
const setValue = require('set-value');
const getValue = require('get-value');
const fs = require('fs');

const sendPush = require('../pushSender/sendPushNotification').sendPushNotification;
const chalk = require('chalk');

function clearCommand(pushSender) {
    pushSender
        .vorpal
        .command('clear')
        .description('reset the project/device/template/message selections.')
        .alias('c')
        .action(function (args, cb) {
            pushSender.updateProject(undefined);
            pushSender.updateDevices(undefined);
            pushSender.updateTemplate(undefined);
            pushSender.updateMessage(undefined);

            cb(undefined);
        })
}

function sendPushNotification(pushSender) {
    try {
        pushSender
            .vorpal
            .command('send [type]')
            .alias('s')
            .description("send: send last message\r\n" +
                "send 1: Send the last message update only template contents\r\n" +
                "send 2: Send the last message update template file and template contents\r\n" +
                "send 3: Send the last message update device selection, template file and template contents\r\n" +
                "send 4: Send the last message update project, device selection, template file and template contents\r\n" +
                ""
            )

            .action(function (args, cb) {
                let type = parseInt(args.type) || 0;
                // 1=> From message
                // 2=> From message, template
                // 3=> From message, template, device
                // 4=> From message, template, device, project

                this.log('type: ' + type);

                Promise.resolve()
                    .then(() => {
                        if (pushSender.project === undefined || type >= 4) {
                            return project.call(this)
                        }
                        return pushSender.project;
                    })
                    .then(project => {
                        pushSender.updateProject(project)

                        if (pushSender.devices === undefined || type >= 3) {
                            return device.call(this);
                        }
                        return pushSender.devices;

                    })
                    .then(devices => {
                        pushSender.updateDevices(devices);
                        if (pushSender.template === undefined || type >= 2) {
                            return template.call(this);
                        }
                        return pushSender.template;

                    })
                    .then(templateFile => {
                        pushSender.updateTemplate(templateFile);

                        if (pushSender.message === undefined || type >= 1) {
                            let data = fs.readFileSync('./input/' + templateFile)
                            let templateJSON = JSON.parse(data);
                            console.log('template json' + JSON.stringify(templateJSON));
                            return {templateJSON: templateJSON};
                        }

                        return {message: pushSender.message};
                    })
                    .then(({message, templateJSON}) => {
                        if (pushSender.message === undefined || type >= 1) {
                            return templatePrompt.call(this, templateJSON);
                        }
                        return message;
                    })
                    .then(message => {
                        this.log('THE MESSAGE:' + JSON.stringify(message));
                        pushSender.updateMessage(message);

                        sendPush({
                            project: pushSender.project,
                            devices: pushSender.devices,
                            message: pushSender.message,
                        });
                        cb(undefined);
                    })
            })
    } catch (e) {
        console.log("Error occured: ", e);
    }
}

function project() {
    let promise = new Promise((resolve, reject) => {
        let prompt = {
            type: 'list',
            name: 'project',
            message: 'Select project to send push notification message.'
        };

        let projects = projectRepository.getProjects();
        if (projects.length === 0) {
            this.log("No project defined. Please type " + chalk.blue.bold('add project') + " to create one.");
            this.cancel();
            return;
        }
        prompt.choices = projects.map(project => {
            return {'name': project.name, 'value': project}
        })

        this.prompt(prompt, ({project}) => {
                resolve(project)
            }
        )
    })
    return promise;
}

function device() {
    let promise = new Promise((resolve, reject) => {

        let prompt = {
            type: 'checkbox',
            name: 'device',
            message: 'Select devices to send push notification message?',
        };

        let devices = deviceRepository.getDevices();
        if (devices.length === 0) {
            this.log("No device defined. Please type " + chalk.blue.bold('add device') + " to create one.");
            this.cancel();
            return;
        }

        prompt.choices = devices.map(device => {
            return {'name': device.name, 'value': device}
        })

        this.prompt(prompt, ({device}) => {
            resolve(device);
        })
    })
    return promise;
}

function template() {
    let promise = new Promise((resolve, reject) => {

        let templates = new Templates();
        templates.list()
            .then(files => {
                let prompt = templates.prompt(files);
                this.prompt(prompt, ({template}) => {
                    resolve(template);
                });
            });
    })

    return promise;
}

function templatePrompt(jsonTemplate) {
    let promise = new Promise((resolve, reject) => {
        let templates = new Templates();

        this.prompt(templates.preparePrompt(null, jsonTemplate), function (result) {
            let message = replaceObject(jsonTemplate, result)
            resolve(message);
        });
    });
    return promise;
}

function replaceObject(source, result) {
    const obj = Object.assign({}, source);

    for (const key in result) {
        if (result.hasOwnProperty(key)) {
            let value = getValue(result, key)
            setValue(obj, key, value)
        }
    }

    return obj;
}

module.exports = {
    sendPushNotification: sendPushNotification,
    clearCommand: clearCommand
}