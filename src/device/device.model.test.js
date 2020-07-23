const {describe} = require('mocha');
const {expect} = require('chai');

const DeviceModel = require('./DeviceModel');

describe('Device models', function () {
    it('should create device model', function () {
        let device = new DeviceModel({name: 'name', token: 'token'});

        expect(device instanceof DeviceModel).to.be.true

        expect(device.name).to.be.a('string');
        expect(device.token).to.be.a('string');
    })

    it('should use constructor parameters', function () {
        let device = new DeviceModel({name: 'name', token: 'token'});

        expect(device.name).is.equal('name');
        expect(device.token).is.equal('token');
    })

    it('should handle white spaces', function () {
        let device = new DeviceModel({name: '   name    ', token: '   token     '});
        expect(device.name).is.equal('name');
        expect(device.token).is.equal('token');
    });
})