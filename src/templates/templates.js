const glob = require('glob');
const path = require('path');

class Templates {
    constructor(props) {
    }

    list(folder = './input/') {
        return new Promise(function (resolve, reject) {
            glob(folder + "*.json", function (err, files) {
                if (err) {
                    reject(err);
                }
                let names = files.map(file => {
                    return path.basename(file)
                });
                resolve(names);
            });
        });
    }

    prompt(names) {
        return {
            type: 'list',
            name: 'template',
            message: 'Select Template',
            choices: names
        }
    }
}

module.exports = Templates


