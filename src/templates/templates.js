const glob = require('glob');
const path = require('path');
const InputTypes = require('./inputTypes');

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

    preparePrompt(root, obj) {
        let prompt = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                if (value === null) {
                    continue
                }
                if (typeof value === 'string' || value instanceof String) {
                    if (value.trim() === InputTypes.TEXT) {
                        prompt.push({
                            type: 'input',
                            name: root ? root + "." + key : key,
                            message: key + ":",
                        })
                    } else if (value.trim() === InputTypes.NUMBER) {
                        prompt.push({
                            type: 'number',
                            name: root ? root + "." + key : key,
                            message: key + ":",
                        })
                    }
                } else if (typeof value === 'object') {
                    let innerPrompt = this.preparePrompt(key, value)
                    if (innerPrompt !== null && innerPrompt.length > 0) {
                        prompt = prompt.concat(innerPrompt)
                    } else {
                        console.log("error!");
                    }
                }
            }
        }

        return prompt;
    }
}

module.exports = Templates


