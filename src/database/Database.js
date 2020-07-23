const fs = require('fs');

class Database {
    constructor(directory) {
        this.directory = directory;
    }

    saveObject(object, file) {
        let data = JSON.stringify(object, null, 4);
        this.writeDataToFile(data, file)
    }

    writeDataToFile(data, fileName) {
        let filePath = this.directory + fileName;
        fs.writeFileSync(filePath, data, 'utf8');
    }

    getJSON(fileName) {
        let path = this.directory + fileName;
        try {
            let data = fs.readFileSync(path, 'utf8')
            let objects = JSON.parse(data);
            if (objects instanceof Array || objects instanceof Object) {
                return objects;
            }

        } catch (e) {
            return [];
        }
        return [];
    }

    clear(fileName) {
        try {
            let path = this.directory + fileName;
            fs.unlinkSync(path);
        } catch (e) {

        }
    }
}

let databaseInstance;

function initialize(directory = "./data/") {
    if (databaseInstance === undefined) {
        databaseInstance = new Database(directory)
    }

    return databaseInstance;
}

function singleton() {
    if (databaseInstance === undefined) {
        throw new Error('DB should be initialized before usage.');
    }
    return databaseInstance;
}

function close() {
    databaseInstance = undefined;
}

module.exports = {
    initialize: initialize,
    singleton: singleton,
    close: close,
};


