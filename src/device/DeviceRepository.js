const db = require('../database/Database').singleton();
const DeviceModel = require('./DeviceModel')
const DEVICE_DB_FILE = "devices.json";
const chalk = require('chalk');

class DeviceRepository {
    constructor(props) {
        this.db = props.db;
    }

    load() {
        let devices = db.getJSON(this.fileName()) || [];
        this.devices = devices.map(d => {
            return new DeviceModel({name: d.name, token: d.token});
        });
    }

    addDevice(device) {
        this.load()
        let found = false;
        this.devices.map(d => {
            if (d.name === device.name) {
                console.log('you already have a device named:' + d.name);
                console.log('can not add it.');
                found = true;
            }

        })
        if (found) {
            return;
        }
        this.devices.push(device);

        this.saveDevicesToFile(this.devices);
    }

    getDevices() {
        this.load();
        return this.devices || [];
    }

    removeDeviceNamed(name) {
        name = name.trim();
        console.log('The name: ' + name);
        this.devices = this.devices.filter(function (d) {
            return d.name !== name;
        });
        this.saveDevicesToFile(this.devices);
    }

    saveDevicesToFile(devices) {
        this.db.saveObject(devices, this.fileName());
        console.log(chalk.italic.grey('Device DB updated.'));
    }

    clear() {
        db.clear(this.fileName());
    }

    fileName() {
        return DEVICE_DB_FILE;
    }
}

module.exports = DeviceRepository;