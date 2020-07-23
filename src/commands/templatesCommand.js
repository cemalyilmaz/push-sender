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
                    let prompt = templates.prompt(files);
                    this.prompt(prompt, ({template}) => {
                        pushSender.updateTemplate(template);
                        cb(undefined, template);
                    });
                })
        })
}

module.exports = {templatesCommand: templatesCommand}