const Templates = require('../templates/templates')

function templatesCommand(pushSender) {
    pushSender
        .vorpal
        .command('select template')
        .alias("use template")
        .alias("ut")
        .action(function (args, cb) {
            let templates = new Templates();
            templates
                .list()
                .then(files => {
                    if (files.length === 0) {
                        this.log("No template found please copy some .json file to " + templates.folder());
                        cb(undefined);
                        return;
                    }

                    let prompt = templates.prompt(files);
                    this.prompt(prompt, ({template}) => {
                        pushSender.updateTemplate(template);
                        cb(undefined, template);
                    });
                })
        })
}

module.exports = {templatesCommand: templatesCommand}