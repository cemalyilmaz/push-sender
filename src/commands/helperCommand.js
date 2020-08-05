const db = require('../database/Database').singleton();

function whereCommand(pushSender) {
    pushSender.vorpal
        .command('where')
        .action(function (args, cb) {
            this.log('current db work under ' + db.directory);
        });
}


module.exports = {
    whereCommand: whereCommand
}