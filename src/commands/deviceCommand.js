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

function editDeviceCommand(pushSender) {
    pushSender.vorpal
        .command('edit device')
        .action(function (args, cb) {
            selectDevice(this, deviceModel => {
                console.log('Devicemodel selected:' + JSON.stringify(deviceModel));
                const prompt = [{
                    type: 'input',
                    name: 'name',
                    default: deviceModel.name,
                    message: 'device name :'
                }, {
                    type: 'input',
                    name: 'token',
                    default: deviceModel.token,
                    message: 'token :'
                }];
                this.prompt(prompt, ({name, token}) => {
                    repository.updateDevice(deviceModel.name, name, token);
                    cb(undefined, deviceModel);
                })
            })
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

function selectDevicesCommand(pushSender) {
    pushSender
        .vorpal
        .command('select devices')
        .alias('use devices')
        .alias('ud')
        .action(function (args, cb) {
            selectDevices(this, devices => {
                pushSender.updateDevices(devices);
                cb(undefined, devices);
            })
        })
}

function selectDevices(command, callback) {
    let prompt = {
        type: 'checkbox',
        name: 'devices',
        message: 'Select devices to send push notification message?'
    };

    let devices = repository.getDevices();
    if (devices.length === 0) {
        this.log("No device defined. Please type " + chalk.blue.bold('add device') + " to create one.");
        callback(undefined);
        return;
    }
    prompt.choices = devices.map(device => {
        return {'name': device.name, 'value': device}
    })

    command.prompt(prompt, ({devices}) => {
        callback(devices);
    });
}


function removeDeviceCommand(pushSender) {
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
                    selectDevice(this, deviceModel => {
                        repository.removeDeviceNamed(args.device)
                        cb(undefined, deviceModel);
                    })

                } else {
                    repository.removeDeviceNamed(args.device)
                    cb(undefined, args.device);
                }
            }
        );
}

function selectDevice(command, callback) {
    let prompt = {
        type: 'list',
        name: 'device',
        message: 'Select device'
    };
    let devices = repository.getDevices();
    prompt.choices = devices.map(device => {
        return {'name': device.name, 'value': device}
    })

    command.prompt(prompt, ({device}) => {
        callback(device);
    })
}

module.exports = {
    addDeviceCommand: addDeviceCommand,
    editDeviceCommand: editDeviceCommand,
    listDevicesCommand: listDevicesCommand,
    selectDeviceCommand: selectDevicesCommand,
    removeDeviceCommand: removeDeviceCommand
}
