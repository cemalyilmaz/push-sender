
// todo: add dry run for 'send' command
// todo: add update project
// todo: add update device

const db = require('./database/Database').initialize();
const vorpal = require('vorpal')();

const PushSender = require('./pushSender/PushSender');
const pushSender = new PushSender(vorpal);
pushSender.loadSettings(db)

const initCommands = require('./commands')
initCommands(pushSender);

vorpal
    .show()
    .parse(process.argv);

