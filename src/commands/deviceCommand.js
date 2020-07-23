const db = require('../database/Database').singleton();
const DeviceRepository = require('../device/DeviceRepository');
const repository = new DeviceRepository({db});
const DeviceModel = require('../device/DeviceModel');
const chalk = require('chalk');
const Table = require('cli-table');

function addDeviceCommand(pushSender) {
    const prompt = [{
        type: 'input',
        name: 'name',
        message: 'device name :'
    }, {
        type: 'input',
        name: 'token',
        message: 'token :'
    }];

    pushSender.vorpal
        .command('add device')
        .action(function (args, cb) {
            this.prompt(prompt, ({name, token}) => {
                const device = new DeviceModel({name, token});
                repository.addDevice(device)
                cb(undefined, device);
            });
        });
}

function renderDevices(command, devices) {
    const table = new Table({
        head: ['NAME', 'TOKEN'], colWidths: [30, 100]
    });

    devices.map(d => {
        table.push([d.name, chalk.greenBright(d.token)]);
    });

    command.log(table.toString());
}

function listDevicesCommand(pushSender) {
    pushSender
        .vorpal
        .command('list devices')
        .alias('devices')
        .action(function (args, cb) {
            const self = this;
            let devices = repository.getDevices()
            renderDevices(self, devices);
            cb(undefined, devices);
        })
}

function selectDeviceCommand(pushSender) {
    let prompt = {
        type: 'checkbox',
        name: 'devices',
        message: 'Select devices to send push notification message?'
    };

    pushSender
        .vorpal
        .command('select devices')
        .alias('use devices')
        .alias('ud')
        .action(function (args, cb) {
                let devices = repository.getDevices();
                if (devices.length === 0) {
                    this.log("No device defined. Please type " + chalk.blue.bold('add device') + " to create one.");
                    cb(undefined);
                    return;
                }
                prompt.choices = devices.map(device => {
                    return {'name': device.name, 'value': device}
                })

                this.prompt(prompt, ({devices}) => {
                    pushSender.updateDevices(devices);
                    cb(undefined, devices);
                })
            }
        )
}

function removeDeviceCommand(pushSender) {
    let prompt = {
        type: 'list',
        name: 'device',
        message: 'Select the device to remove.'
    };

    pushSender
        .vorpal
        .command('remove device [device]')
        .autocomplete({
            data: function () {
                return repository.getDevices().map(d => "'" + d.name + "'");
            }
        })
        .action(function (args, cb) {
                if (args.device === undefined) {
                    let devices = repository.getDevices();
                    if (devices.length === 0) {
                        this.log('No devices defined.');
                        cb(undefined);
                        return;
                    }
                    prompt.choices = devices.map(device => {
                        return device.name
                    })

                    this.prompt(prompt, ({device}) => {
                        repository.removeDeviceNamed(device)
                        cb(undefined, device);
                    })
                } else {
                    repository.removeDeviceNamed(args.device)
                    cb(undefined, args.device);
                }
            }
        );
}

module.exports = {
    addDeviceCommand: addDeviceCommand,
    listDevicesCommand: listDevicesCommand,
    selectDeviceCommand: selectDeviceCommand,
    removeDeviceCommand: removeDeviceCommand
}
