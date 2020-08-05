const fs = require('fs');
const rootFolder = require('../settings').rootFolder;
const chalk = require('chalk');

class Database {
    constructor(directory) {
        this.directory = directory;
        this.assureFolderExists();
    }

    assureFolderExists() {
        if (!fs.existsSync(this.directory)) {
            console.log('Initialized db at ' + chalk.greenBright(this.directory));
            fs.mkdirSync(this.directory);
        }

        let templatesFolder = this.directory + '/templates/';
        if (!fs.existsSync(templatesFolder)) {
            console.log('Templates folder created at ' + chalk.greenBright(templatesFolder));
            fs.mkdirSync(templatesFolder);
        }
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

function initialize(directory = rootFolder()) {
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


