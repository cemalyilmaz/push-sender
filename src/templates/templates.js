const glob = require('glob');
const fs = require('fs');
const path = require('path');
const templatesFolder = require('../settings/').templatesFolder;


class Templates {
    constructor(props) {
    }

    list(folder = templatesFolder()) {
        return new Promise(function (resolve, reject) {
            glob(folder + "/*.json", function (err, files) {

                if (err) {
                    reject(err);
                }
                if (files === undefined || files === null) {
                    reject();
                    return;
                }
                let names = files.map(file => {
                    return path.basename(file)
                });
                console.log('Names:' + names);
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

    readTemplateToJson(templateFile) {
        let data = fs.readFileSync(templatesFolder() + templateFile)
        let templateJSON = JSON.parse(data);
        return templateJSON;
    }
}

module.exports = Templates


