const db = require('../database/Database').singleton();

const ProjectRepository = require('../project/ProjectRepository');
const projectRepository = new ProjectRepository({db});

const DeviceRepository = require('../device/DeviceRepository');
const deviceRepository = new DeviceRepository({db});

const Templates = require('../templates/templates');
const rootFolder = require('../settings').rootFolder;
const {preparePrompt, replaceObject} = require('../prompt/PromptBuilder');

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
            .option('-d, --dry', 'do not send message, only log.')
            .alias('s')
            .description("send: send last message\r\n" +
                "send 1: Send the last message update only template contents\r\n" +
                "send 2: Send the last message update template file and template contents\r\n" +
                "send 3: Send the last message update device selection, template file and template contents\r\n" +
                "send 4: Send the last message update project, device selection, template file and template contents\r\n" +
                "use --dry option to log the options on screen (but do not send). " +
                ""
            )
            .action(function (args, cb) {
                let dry = args.options.dry
                let type = parseInt(args.type) || 0;
                // 1=> From message
                // 2=> From message, template
                // 3=> From message, template, device
                // 4=> From message, template, device, project
                sendMessage.call(this, pushSender, type, dry, cb);
            })
    } catch (e) {
        console.log("Error occured: ", e);
    }
}

function sendMessage(pushSender, type, dry, cb) {
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
                let templates = new Templates();
                return {templateJSON: templates.readTemplateToJson(templateFile)};
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
            }, dry);
            cb(undefined);
        })
}

function project() {
    let promise = new Promise((resolve) => {
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
    let promise = new Promise((resolve) => {

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
        templates
            .list()
            .then(files => {
                if (files === undefined || files === null || files.length === 0) {
                    console.log('Can not find a template');
                    reject();
                    return;
                }
                let prompt = templates.prompt(files);

                this.prompt(prompt, ({template}) => {
                    resolve(template);
                });
            });
    })

    return promise;
}

function templatePrompt(jsonTemplate) {
    let promise = new Promise((resolve) => {
        this.prompt(preparePrompt(null, jsonTemplate), function (result) {
            let message = replaceObject(jsonTemplate, result)
            resolve(message);
        });
    });
    return promise;
}

module.exports = {
    sendPushNotification: sendPushNotification,
    clearCommand: clearCommand
}