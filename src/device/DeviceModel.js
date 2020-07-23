class DeviceModel {
    constructor({name, token}) {
        this.name = name.trim();
        this.token = token.trim();
    }

    toString() {
        return this.name;
    }
}

module.exports = DeviceModel
