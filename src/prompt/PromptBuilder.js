const InputTypes = require('./inputTypes');
const setValue = require('set-value');
const getValue = require('get-value');

function preparePrompt(root, object) {

    let prompt = [];
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            let value = object[key];
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
                let innerPrompt = preparePrompt(key, value)
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

function replaceObject(source, result) {
    const obj = Object.assign({}, source);

    for (const key in result) {
        if (result.hasOwnProperty(key)) {
            let value = getValue(result, key)
            setValue(obj, key, value)
        }
    }

    return obj;
}


module.exports = {
    preparePrompt: preparePrompt,
    replaceObject: replaceObject,
}