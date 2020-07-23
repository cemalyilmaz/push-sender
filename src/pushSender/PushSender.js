const db = require('../database/Database').singleton();
const LAST_SELECTION_DB_FILE = "last_selection.json";

class PushSender {
    constructor(vorpal) {
        this.vorpal = vorpal
        this.project = undefined;
        this.devices = undefined;
        this.template = undefined;
        this.message = undefined;
    }

    updateProject(project) {
        this.project = project;
        this.updateDelimiter();
        this.saveSettings();
    }

    updateDevices(devices) {
        this.devices = devices;
        this.updateDelimiter();
        this.saveSettings();
    }

    updateTemplate(template) {
        this.template = template;
        this.updateDelimiter();
        this.saveSettings();
    }

    updateMessage(message) {
        this.message = message;
        this.updateDelimiter();
        this.saveSettings();
    }

    updateDelimiter() {
        let delimiter = 'push-sender'
        if (this.project !== undefined) {
            delimiter += '@' + this.project.name;
        }
        if (this.devices !== undefined) {
            delimiter += '[';
            delimiter += this.devices.map(d => d.name).join(', ');
            delimiter += ']';
        }
        // if (this.template !== undefined) {
        //     delimiter += '-' + this.template + "";
        // }
        // if (this.message !== undefined) {
        //     delimiter += "<M>";
        // }
        delimiter += ": ";
        this.vorpal.delimiter(delimiter);
    }

    loadSettings() {
        let config = db.getJSON(LAST_SELECTION_DB_FILE) || {};
        this.project = config.project;
        this.devices = config.devices;
        this.template = config.template;
        this.message = config.message;

        this.updateDelimiter();
    }

    saveSettings() {
        db.saveObject({
            project: this.project,
            devices: this.devices,
            template: this.template,
            message: this.message,
        }, LAST_SELECTION_DB_FILE);
    }
}

module.exports = PushSender