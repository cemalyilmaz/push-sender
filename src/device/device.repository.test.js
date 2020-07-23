const {describe} = require('mocha');
const {expect} = require('chai');

let DB = require('../database/Database');
DB.initialize('./test/');
const db = DB.singleton();

const DeviceModel = require('./DeviceModel');
const DeviceRepository = require('./DeviceRepository');
const repository = new DeviceRepository({db});

describe('Device repository tests', function () {
    it('should construct have class defined. ', function () {
        let repository1 = new DeviceRepository({db});
        expect(repository1 instanceof DeviceRepository).to.be.true
    })

    it('should add device ', function () {
        repository.clear();
        repository.addDevice(new DeviceModel({name: "name", token: "token"}));
        expect(1).to.equal(repository.getDevices().length);

        let dm = repository.getDevices()[0];
        expect(dm.name).to.equal("name");
        expect(dm.token).to.equal("token");
    });

    it('should not add a device with same name', function () {
        repository.clear();
        repository.addDevice(new DeviceModel({name: "name", token: "token"}));
        repository.addDevice(new DeviceModel({name: "name", token: "token"}));
        expect(repository.getDevices().length).to.equal(1);
    });

    it('should remove device with a name', function () {
        repository.clear();
        repository.addDevice(new DeviceModel({name: 'name1', token: 'token1'}));
        repository.addDevice(new DeviceModel({name: 'name2', token: 'token2'}));
        repository.removeDeviceNamed('name1');

        expect(1).to.equal(repository.getDevices().length);
        let dm = repository.getDevices()[0];
        expect(dm.name).is.equal('name2');
        expect(dm.token).is.equal('token2');
    })

    it('should clear objects ', function () {
        repository.clear();
        repository.addDevice(new DeviceModel({name: 'name1', token: 'token1'}));
        repository.clear();
        expect(repository.getDevices().length).is.equal(0);
    });

})

