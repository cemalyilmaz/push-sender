const Templates = require('../templates/templates');
const setValue = require('set-value');
const getValue = require('get-value');
const fs = require('fs');
const chalk = require('chalk');

function showMessageCommand(pushSender) {
    pushSender
        .vorpal
        .command('show message')
        .alias('m')
        .action(function (args, cb) {

            this.log(chalk.blue('Message:') + '\r\n' + JSON.stringify(pushSender.message, null, 2));
            cb(undefined)
        })
}

function messageCommand(pushSender) {
    pushSender
        .vorpal
        .command('build message')
        .alias('bm')
        .action(function (args, cb) {
            let templates = new Templates();
            templates.list().then(files => {
                let prompt = templates.prompt(files);

                this.prompt(prompt, result => {
                    let data = fs.readFileSync('./input/' + result.template)
                    let template = JSON.parse(data);

                    this.prompt(templates.preparePrompt(null, template), function (result) {
                        let message = replaceObject(template, result)
                        pushSender.updateMessage(message);
                        cb(undefined, message);
                    });
                });
            })
        });
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
    buildMessageCommand: messageCommand,
    showMessageCommand: showMessageCommand
}