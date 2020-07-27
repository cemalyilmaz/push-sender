class DeviceModel {
    constructor({name, token}) {
        if (name === undefined || token === undefined) {
            throw  new Error('DeviceModel should have name and token.');
        }
        this.name = name.trim();
        this.token = token.trim();
    }

    toString() {
        return this.name;
    }
}

module.exports = DeviceModel
